package com.smartcare.repository;

import com.smartcare.model.SimulatedEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SimulatedEmailRepository extends JpaRepository<SimulatedEmail, Long> {
    List<SimulatedEmail> findByToOrderBySentAtDesc(String to);
}
