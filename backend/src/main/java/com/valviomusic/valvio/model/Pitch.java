package com.valviomusic.valvio.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table
public class Pitch {

    @Id
    private String id;

    @Column
    private String noteLetter;

    @Column
    private String accidental;

    @Column
    private short octave;

    @Column
    private short midiNumber;

    @Column
    private short position;

    @ManyToMany(mappedBy = "pitchList")
    private List<Quiz> quizList;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNoteLetter() {
        return noteLetter;
    }

    public void setNoteLetter(String noteLetter) {
        this.noteLetter = noteLetter;
    }

    public String getAccidental() {
        return accidental;
    }

    public void setAccidental(String accidental) {
        this.accidental = accidental;
    }

    public short getOctave() {
        return octave;
    }

    public void setOctave(short octave) {
        this.octave = octave;
    }

    public short getMidiNumber() {
        return midiNumber;
    }

    public void setMidiNumber(short midiNumber) {
        this.midiNumber = midiNumber;
    }

    public short getPosition() {
        return position;
    }

    public void setPosition(short position) {
        this.position = position;
    }
}
