package com.valviomusic.valvio.controller;

import com.valviomusic.valvio.controller.dto.response.QuizResponseDto;
import com.valviomusic.valvio.model.Quiz;
import com.valviomusic.valvio.repository.QuizRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    private final QuizRepository quizRepository;

    public QuizController(
            QuizRepository quizRepository
    ){
        this.quizRepository = quizRepository;
    }

    @GetMapping
    public ResponseEntity<List<QuizResponseDto>> getAllQuizzes(){

        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponseDto> quizResponseDtoList = quizzes.stream()
                .map(QuizResponseDto::fromModel)
                .toList();

        return new ResponseEntity<>(quizResponseDtoList, HttpStatus.OK);
    }

}
