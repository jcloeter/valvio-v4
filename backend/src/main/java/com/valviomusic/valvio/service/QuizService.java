package com.valviomusic.valvio.service;

import com.valviomusic.valvio.model.Quiz;
import com.valviomusic.valvio.model.QuizAttempt;
import com.valviomusic.valvio.repository.QuizAttemptRepository;
import com.valviomusic.valvio.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class QuizService {

    private QuizRepository quizRepository;
    private QuizAttemptRepository quizAttemptRepository;

    public QuizService(
            QuizRepository quizRepository,
            QuizAttemptRepository quizAttemptRepository
    ){
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public Quiz createQuizAttempt(Long quizId){

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + quizId));

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setQuiz(quiz);
        quizAttempt.setStartedAt(OffsetDateTime.now());

        quizAttemptRepository.save(quizAttempt);

        return quiz;
    }

}
