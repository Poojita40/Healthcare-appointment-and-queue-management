package com.smartcare.repository;

import com.smartcare.model.Queue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface QueueRepository extends JpaRepository<Queue, Long> {
    Optional<Queue> findByDoctorId(Long doctorId);
}
