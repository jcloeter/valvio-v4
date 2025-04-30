package com.valviomusic.valvio.model;

import jakarta.persistence.*;

@Entity
public class QuizPitch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "pitch_id", nullable = false)
    private String pitchId;

    @Column(name = "transposed_answer_pitch_id")
    private String transposedAnswerPitchId;

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

    public String getPitchId() {
        return pitchId;
    }

    public void setPitchId(String pitchId) {
        this.pitchId = pitchId;
    }

    public String getTransposedAnswerPitchId() {
        return transposedAnswerPitchId;
    }

    public void setTransposedAnswerPitchId(String transposedAnswerPitchId) {
        this.transposedAnswerPitchId = transposedAnswerPitchId;
    }
}
