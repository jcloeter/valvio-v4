package com.valviomusic.valvio.model;

import jakarta.persistence.*;
import java.util.List;
import com.valviomusic.valvio.model.QuizPitch;
import com.valviomusic.valvio.model.QuizUnit;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "quiz_unit_id")
    private QuizUnit quizUnit;

    @ManyToOne
    @JoinColumn(name = "quiz_type_id")
    private QuizType quizType;

    private Long level;

    private Long length;

    @OneToMany(mappedBy = "quiz")
    private List<QuizPitch> quizPitches;

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

    public QuizUnit getQuizUnit() {
        return quizUnit;
    }

    public void setQuizUnit(QuizUnit quizUnit) {
        this.quizUnit = quizUnit;
    }

    public QuizType getQuizType() {
        return quizType;
    }

    public void setQuizType(QuizType quizType) {
        this.quizType = quizType;
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

    public List<QuizPitch> getQuizPitches() {
        return quizPitches;
    }

    public void setQuizPitches(List<QuizPitch> quizPitches) {
        this.quizPitches = quizPitches;
    }
}
