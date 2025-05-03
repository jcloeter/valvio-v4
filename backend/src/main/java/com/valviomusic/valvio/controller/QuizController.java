package com.valviomusic.valvio.controller;

import com.valviomusic.valvio.controller.dto.response.QuizResponseDto;
import com.valviomusic.valvio.model.Quiz;
import com.valviomusic.valvio.repository.QuizRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/{id}/pitches")
    public ResponseEntity<QuizResponseDto> getPitchesForQuiz(
            @PathVariable Long id
    ){
        Optional<Quiz> optionalQuiz = quizRepository.findById(id);

        if (optionalQuiz.isEmpty()){
            throw new RuntimeException("Invalid quiz Id");
        }

        Quiz quiz = optionalQuiz.get();
        QuizResponseDto quizResponseDto = QuizResponseDto.fromModel(quiz);
        return new ResponseEntity<>(quizResponseDto, HttpStatus.OK);
    }

}
