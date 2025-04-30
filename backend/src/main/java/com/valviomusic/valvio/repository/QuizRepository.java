package com.valviomusic.valvio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.valviomusic.valvio.model.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
