package com.valviomusic.valvio.model;

import jakarta.persistence.*;
import java.util.List;

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

    @ManyToMany()
    @JoinTable(
            name = "quiz_pitch",
            joinColumns = @JoinColumn(name = "quiz_id"),
            inverseJoinColumns = @JoinColumn(name = "pitch_id")
    )
    private List<Pitch> pitchList;

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

    public List<Pitch> getPitchList() {
        return pitchList;
    }

    public void setPitchList(List<Pitch> pitchList) {
        this.pitchList = pitchList;
    }

}
