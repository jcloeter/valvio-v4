package com.valviomusic.valvio.controller;

import com.valviomusic.valvio.controller.dto.response.QuizAttemptResponseDto;
import com.valviomusic.valvio.controller.dto.response.QuizResponseDto;
import com.valviomusic.valvio.model.Quiz;
import com.valviomusic.valvio.model.QuizAttempt;
import com.valviomusic.valvio.repository.QuizRepository;
import com.valviomusic.valvio.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

        return new ResponseEntity<>(quizResponseDtoList, HttpStatus.OK);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<QuizAttemptResponseDto> startQuiz(
            @PathVariable Long id
    ){
        QuizAttempt quizAttempt = quizService.startQuiz(id);
        QuizAttemptResponseDto quizAttemptResponseDto = QuizAttemptResponseDto.fromModel(quizAttempt);

        return new ResponseEntity<>(quizAttemptResponseDto, HttpStatus.CREATED);
    }

}
