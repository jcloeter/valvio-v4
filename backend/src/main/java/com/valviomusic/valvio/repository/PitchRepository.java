package com.valviomusic.valvio.repository;

import com.valviomusic.valvio.model.Pitch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PitchRepository extends JpaRepository<Pitch, String> {

}
