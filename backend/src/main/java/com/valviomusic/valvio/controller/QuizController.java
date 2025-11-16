package com.valviomusic.valvio.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.valviomusic.valvio.controller.dto.response.QuizAttemptResponseDto;
import com.valviomusic.valvio.controller.dto.response.QuizResponseDto;
import com.valviomusic.valvio.model.Quiz;
import com.valviomusic.valvio.model.QuizAttempt;
import com.valviomusic.valvio.model.User;
import com.valviomusic.valvio.repository.QuizRepository;
import com.valviomusic.valvio.service.QuizService;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    private final QuizRepository quizRepository;

    private final QuizService quizService;

    public QuizController(
            QuizRepository quizRepository,
            QuizService quizService
    ){
        this.quizRepository = quizRepository;
        this.quizService = quizService;
    }

    @GetMapping
    public ResponseEntity<List<QuizResponseDto>> getAllQuizzes(){
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponseDto> quizResponseDtoList = quizzes.stream()
                .map(QuizResponseDto::fromModel)
                .toList();

        System.out.println("Getting all quizzes");

        return new ResponseEntity<>(quizResponseDtoList, HttpStatus.OK);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<QuizAttemptResponseDto> startQuiz(
            @PathVariable Long id
    ){
        // Get the authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        QuizAttempt quizAttempt = quizService.startQuiz(id, user);
        QuizAttemptResponseDto quizAttemptResponseDto = QuizAttemptResponseDto.fromModel(quizAttempt);

        System.out.println("Starting quiz id " + id + " for user " + user.getFirebaseUid());

        return new ResponseEntity<>(quizAttemptResponseDto, HttpStatus.CREATED);
    }

}
