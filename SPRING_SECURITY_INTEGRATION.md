# Firebase Authentication + Spring Security Integration

This document explains how Firebase Authentication integrates with Spring Security in the Valvio application.

## Why This Architecture?

Traditional Spring Security uses:
- Username/password stored in database
- Session-based authentication (JSESSIONID cookie)
- UserDetailsService for loading users

Firebase + Spring Security uses:
- Firebase handles authentication (OAuth, email/password, etc.)
- Token-based authentication (JWT-like Firebase ID tokens)
- Custom filter for token verification
- Stateless - no server sessions needed

## Spring Security Filter Chain

Spring Security uses a chain of filters to process requests. We've added our custom Firebase filter:

```
HTTP Request
    ↓
1. CorsFilter (handles CORS preflight)
    ↓
2. FirebaseAuthenticationFilter (our custom filter) ← We added this
    ↓
3. UsernamePasswordAuthenticationFilter (skipped, not used)
    ↓
4. FilterSecurityInterceptor (checks authorization)
    ↓
5. Your Controller (QuizController, etc.)
```

## How FirebaseAuthenticationFilter Works

```java
@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        // 1. Extract token from Authorization header
        String token = extractToken(request);
        
        if (token != null) {
            try {
                // 2. Verify token with Firebase (cryptographic verification)
                FirebaseToken firebaseToken = FirebaseAuth.getInstance()
                    .verifyIdToken(token);
                
                // 3. Get or create user in our database
                User user = userService.findOrCreateUser(firebaseToken);
                
                // 4. Create Spring Security authentication object
                Authentication auth = new UsernamePasswordAuthenticationToken(
                    user,           // Principal (the user)
                    null,           // Credentials (not needed)
                    new ArrayList<>() // Authorities (permissions)
                );
                
                // 5. Store in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(auth);
                
            } catch (Exception e) {
                // Invalid token - don't set authentication
                // Request will be rejected as unauthorized
            }
        }
        
        // 6. Continue to next filter
        filterChain.doFilter(request, response);
    }
}
```

## SecurityConfig Explained

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            // 1. Disable CSRF (not needed for stateless token auth)
            .csrf(csrf -> csrf.disable())
            
            // 2. Make sessions stateless
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Configure which endpoints require auth
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**")
                    .permitAll()  // Swagger docs are public
                .anyRequest()
                    .authenticated()  // Everything else requires auth
            )
            
            // 4. Add our Firebase filter before the default one
            .addFilterBefore(
                firebaseAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class
            );
            
        return http.build();
    }
}
```

## Getting the Authenticated User in Controllers

In your controllers, you can access the authenticated user in multiple ways:

### Method 1: Via SecurityContextHolder (used in our implementation)

```java
@PostMapping("/{id}/start")
public ResponseEntity<QuizAttemptResponseDto> startQuiz(@PathVariable Long id) {
    // Get authentication from SecurityContext
    Authentication authentication = SecurityContextHolder
        .getContext()
        .getAuthentication();
    
    // Cast principal to User
    User user = (User) authentication.getPrincipal();
    
    // Use the user
    QuizAttempt attempt = quizService.startQuiz(id, user);
    return ResponseEntity.ok(dto);
}
```

### Method 2: Via @AuthenticationPrincipal (cleaner alternative)

```java
@PostMapping("/{id}/start")
public ResponseEntity<QuizAttemptResponseDto> startQuiz(
    @PathVariable Long id,
    @AuthenticationPrincipal User user  // Spring automatically injects this
) {
    QuizAttempt attempt = quizService.startQuiz(id, user);
    return ResponseEntity.ok(dto);
}
```

### Method 3: Via Authentication parameter

```java
@PostMapping("/{id}/start")
public ResponseEntity<QuizAttemptResponseDto> startQuiz(
    @PathVariable Long id,
    Authentication authentication
) {
    User user = (User) authentication.getPrincipal();
    QuizAttempt attempt = quizService.startQuiz(id, user);
    return ResponseEntity.ok(dto);
}
```

## Token Verification Flow

```
1. Client sends request:
   POST /quiz/1/start
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3...

2. FirebaseAuthenticationFilter intercepts request

3. Token is extracted from Authorization header

4. Firebase Admin SDK verifies token:
   - Checks cryptographic signature
   - Verifies issuer (Firebase)
   - Checks expiration time
   - Validates audience (your project)

5. If valid:
   - Extract user info (uid, email, name, etc.)
   - Find or create user in PostgreSQL
   - Create Authentication object
   - Set in SecurityContext
   
6. If invalid:
   - Log error
   - Don't set authentication
   - Continue to next filter

7. FilterSecurityInterceptor checks authorization:
   - Is authentication present? 
   - If yes → allow request
   - If no → return 401 Unauthorized

8. If authorized, request reaches controller:
   - Controller accesses user via SecurityContext
   - Business logic executes
   - Response returned
```

## Authentication vs Authorization

**Authentication** = "Who are you?"
- Handled by Firebase + our filter
- Verifies identity via token
- Creates Authentication object in SecurityContext

**Authorization** = "What are you allowed to do?"
- Handled by Spring Security
- Checks if authenticated user has required permissions
- Currently: Just checks if user is authenticated

## Adding Role-Based Access Control

Currently, all authenticated users have the same permissions. To add roles:

### 1. Update User Entity

```java
@Entity
public class User {
    // ... existing fields ...
    
    @Enumerated(EnumType.STRING)
    private UserRole role;  // ADMIN, TEACHER, STUDENT, GUEST
}
```

### 2. Update Filter to Include Authorities

```java
// In FirebaseAuthenticationFilter
List<GrantedAuthority> authorities = List.of(
    new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
);

Authentication auth = new UsernamePasswordAuthenticationToken(
    user, 
    null, 
    authorities  // Now includes roles
);
```

### 3. Use in SecurityConfig

```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/admin/**").hasRole("ADMIN")
    .requestMatchers("/teacher/**").hasRole("TEACHER")
    .anyRequest().authenticated()
)
```

### 4. Use in Controllers

```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/quiz/{id}")
public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
    // Only admins can delete quizzes
}
```

## Custom Annotations (Future Feature)

You mentioned wanting to use annotations instead of custom code. Here's how that would work:

### Create Custom Annotation

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireAuth {
    String[] roles() default {};
    boolean allowAnonymous() default false;
}
```

### Create Aspect

```java
@Aspect
@Component
public class AuthenticationAspect {
    
    @Before("@annotation(requireAuth)")
    public void checkAuthentication(RequireAuth requireAuth) {
        Authentication auth = SecurityContextHolder
            .getContext()
            .getAuthentication();
            
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Not authenticated");
        }
        
        User user = (User) auth.getPrincipal();
        
        if (!requireAuth.allowAnonymous() && user.getIsAnonymous()) {
            throw new AccessDeniedException("Anonymous users not allowed");
        }
        
        if (requireAuth.roles().length > 0) {
            // Check if user has required role
        }
    }
}
```

### Use in Controllers

```java
@RequireAuth(roles = {"ADMIN"})
@DeleteMapping("/quiz/{id}")
public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
    // Only admins can access
}

@RequireAuth(allowAnonymous = false)
@PostMapping("/quiz/{id}/complete")
public ResponseEntity<?> completeQuiz(@PathVariable Long id) {
    // Authenticated users only, no guests
}
```

## Stateless vs Stateful Authentication

### Stateful (Traditional Spring Security)
```
Client                    Server
  |                         |
  |-- POST /login -------->|
  |                    [Create session]
  |                    [Store in memory/Redis]
  |<-- JSESSIONID ---------|
  |                         |
  |-- GET /quiz ---------->|
  |   Cookie: JSESSIONID   |
  |                    [Lookup session]
  |                    [Deserialize user]
  |<-- Response ---------- |

Pros: Simple, built-in
Cons: Doesn't scale horizontally, mobile unfriendly
```

### Stateless (Our Firebase Implementation)
```
Client                    Server
  |                         |
  |-- Login to Firebase -->|
  |<-- ID Token ---------- |
  |                         |
  |-- GET /quiz ---------->|
  |   Authorization: Bearer token
  |                    [Verify token]
  |                    [Extract user info]
  |                    [No session lookup]
  |<-- Response ---------- |

Pros: Scales horizontally, mobile-friendly, no session storage
Cons: Slightly more complex setup
```

## Security Benefits

1. **No password storage** - Firebase handles it
2. **Cryptographic verification** - Tokens can't be forged
3. **Short-lived tokens** - Expire after 1 hour
4. **Automatic key rotation** - Firebase rotates signing keys
5. **Stateless** - No session hijacking possible
6. **CORS protection** - Only allowed origins can call API
7. **HTTPS enforcement** - Tokens should only be sent over HTTPS

## Production Checklist

- [ ] Enable HTTPS (required for OAuth)
- [ ] Set up proper CORS for production domains
- [ ] Use environment variables for Firebase credentials
- [ ] Enable Firebase App Check for bot protection
- [ ] Set up monitoring/logging for authentication failures
- [ ] Implement rate limiting
- [ ] Add email verification requirement
- [ ] Set up password policy in Firebase Console
- [ ] Regular security audits
- [ ] Rotate service account keys periodically

## Common Questions

**Q: Can I still use Spring Security's built-in login page?**
A: No, we're using Firebase's authentication. The frontend handles the login UI.

**Q: How do I test endpoints that require authentication?**
A: Get a token from Firebase after logging in (check browser dev tools), then include it in your API requests.

**Q: Can I mix Firebase auth with traditional Spring Security?**
A: Yes, but it's complex and not recommended. Pick one approach.

**Q: Do I need a UserDetailsService?**
A: No, we're not using Spring Security's built-in authentication mechanism.

**Q: How do I handle token expiration?**
A: The frontend automatically refreshes tokens. If a request fails with 401, the frontend should refresh and retry.

**Q: Can anonymous users do everything?**
A: Currently yes. You'd need to add custom logic to restrict anonymous users.

**Q: Where are passwords stored?**
A: In Firebase, not in your database. Your database only stores the Firebase UID.

## Debugging Tips

### Enable Spring Security Debug Logging

```properties
# application.properties
logging.level.org.springframework.security=DEBUG
```

### Check Token in Browser

```javascript
// In browser console after logging in
firebase.auth().currentUser.getIdToken().then(token => console.log(token));
```

### Test Token Verification

```bash
# Use curl to test authentication
TOKEN="your_firebase_token"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/quiz
```

### Check Database User Creation

```sql
-- Check if users are being created
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Check if quiz attempts are linked to users
SELECT qa.*, u.email 
FROM quiz_attempt qa 
LEFT JOIN users u ON qa.user_id = u.id;
```

## Resources

- [Spring Security Architecture](https://spring.io/guides/topicals/spring-security-architecture)
- [Firebase ID Token Verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Understanding JWT](https://jwt.io/introduction)
- [Spring Security Filter Chain](https://docs.spring.io/spring-security/reference/servlet/architecture.html)

