package com.valviomusic.valvio.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizPitchAttempt> quizPitchAttempts;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public OffsetDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(OffsetDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(OffsetDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<QuizPitchAttempt> getQuizPitchAttempts() {
        return quizPitchAttempts;
    }

    public void setQuizPitchAttempts(List<QuizPitchAttempt> quizPitchAttempts) {
        this.quizPitchAttempts = quizPitchAttempts;
    }
}
