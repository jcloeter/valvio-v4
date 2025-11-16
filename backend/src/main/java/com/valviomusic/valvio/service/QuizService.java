package com.valviomusic.valvio.service;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.valviomusic.valvio.model.Quiz;
import com.valviomusic.valvio.model.QuizAttempt;
import com.valviomusic.valvio.model.User;
import com.valviomusic.valvio.repository.QuizAttemptRepository;
import com.valviomusic.valvio.repository.QuizRepository;

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

    public QuizAttempt startQuiz(Long quizId, User user){

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + quizId));

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setQuiz(quiz);
        quizAttempt.setUser(user);
        quizAttempt.setStartedAt(OffsetDateTime.now());

        quizAttemptRepository.save(quizAttempt);

        return quizAttempt;
    }

}
