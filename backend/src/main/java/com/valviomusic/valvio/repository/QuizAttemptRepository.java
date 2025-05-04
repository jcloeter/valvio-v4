package com.valviomusic.valvio.repository;

import com.valviomusic.valvio.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
}
