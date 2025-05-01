package com.valviomusic.valvio.controller.dto.response;

import com.valviomusic.valvio.model.Quiz;

public class QuizResponseDto {

    private Long id;
    private String name;
    private String quizUnitName; // Simplified to just the name
    private String quizTypeName; // Simplified to just the name
    private Long level;
    private Long length;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuizUnitName() {
        return quizUnitName;
    }

    public void setQuizUnitName(String quizUnitName) {
        this.quizUnitName = quizUnitName;
    }

    public String getQuizTypeName() {
        return quizTypeName;
    }

    public void setQuizTypeName(String quizTypeName) {
        this.quizTypeName = quizTypeName;
    }

    public Long getLevel() {
        return level;
    }

    public void setLevel(Long level) {
        this.level = level;
    }

    public Long getLength() {
        return length;
    }

    public void setLength(Long length) {
        this.length = length;
    }

    // Method to convert from model to DTO
    public static QuizResponseDto fromModel(Quiz quiz) {
        QuizResponseDto dto = new QuizResponseDto();
        dto.setId(quiz.getId());
        dto.setName(quiz.getName());
        dto.setQuizUnitName(quiz.getQuizUnit().getName());
        dto.setQuizTypeName(quiz.getQuizType().getName());
        dto.setLevel(quiz.getLevel());
        dto.setLength(quiz.getLength());
        return dto;
    }
}