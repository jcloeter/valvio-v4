package com.valviomusic.valvio.model;

import jakarta.persistence.*;
        import java.time.OffsetDateTime;

@Entity
public class QuizPitchAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_attempt_id", nullable = false)
    private QuizAttempt quizAttempt;

    @Column(name = "pitch_id", nullable = false)
    private String pitchId;

    @Column(name = "user_input")
    private String userInput;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuizAttempt getQuizAttempt() {
        return quizAttempt;
    }

    public void setQuizAttempt(QuizAttempt quizAttempt) {
        this.quizAttempt = quizAttempt;
    }

    public String getPitchId() {
        return pitchId;
    }

    public void setPitchId(String pitchId) {
        this.pitchId = pitchId;
    }

    public String getUserInput() {
        return userInput;
    }

    public void setUserInput(String userInput) {
        this.userInput = userInput;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
