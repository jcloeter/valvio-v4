package com.valviomusic.valvio.controller.dto.response;

import com.valviomusic.valvio.model.QuizAttempt;

import java.time.OffsetDateTime;

public class QuizAttemptResponseDto {

    private Long id;
    private QuizResponseDto quiz;
    private OffsetDateTime startedAt;
    private OffsetDateTime completedAt;

    public QuizAttemptResponseDto(Long id, QuizResponseDto quiz, OffsetDateTime startedAt, OffsetDateTime completedAt) {
        this.id = id;
        this.quiz = quiz;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public QuizResponseDto getQuiz() {
        return quiz;
    }

    public OffsetDateTime getStartedAt() {
        return startedAt;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public static QuizAttemptResponseDto fromModel(QuizAttempt quizAttempt) {
        return new QuizAttemptResponseDto(
                quizAttempt.getId(),
                QuizResponseDto.fromModel(quizAttempt.getQuiz()),
                quizAttempt.getStartedAt(),
                quizAttempt.getCompletedAt()
        );
    }
}
