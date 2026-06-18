package com.smartcare.repository;

import com.smartcare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, String status);
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(Long doctorId, java.time.LocalDate date, String time);
}
