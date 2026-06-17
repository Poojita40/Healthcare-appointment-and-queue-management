package com.smartcare.service;

import com.smartcare.model.Queue;
import com.smartcare.model.Appointment;
import com.smartcare.repository.QueueRepository;
import com.smartcare.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class QueueService {

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Queue> getLiveQueueStatus() {
        return queueRepository.findAll();
    }

    public Queue nextPatient(Long doctorId) {
        Queue q = queueRepository.findByDoctorId(doctorId)
                .orElseThrow(() -> new RuntimeException("Queue metadata not configured for doctor."));

        // Select the next lowest pending appointment
        List<Appointment> pendings = appointmentRepository.findByDoctorIdAndStatus(doctorId, "PENDING");
        if (!pendings.isEmpty()) {
            Appointment nextAppt = pendings.stream()
                    .min((a1, a2) -> Integer.compare(a1.getTokenNumber(), a2.getTokenNumber()))
                    .get();

            nextAppt.setStatus("CONFIRMED");
            appointmentRepository.save(nextAppt);
            q.setCurrentToken(nextAppt.getTokenNumber());
        } else {
            q.setCurrentToken(q.getNextToken() - 1);
        }

        return queueRepository.save(q);
    }

    public void completeConsultation(Long doctorId, Integer tokenNumber) {
        List<Appointment> active = appointmentRepository.findByDoctorIdAndStatus(doctorId, "CONFIRMED");
        for (Appointment a : active) {
            if (a.getTokenNumber().equals(tokenNumber)) {
                a.setStatus("COMPLETED");
                appointmentRepository.save(a);
            }
        }
    }

    public void skipPatient(Long doctorId, Integer tokenNumber) {
        List<Appointment> active = appointmentRepository.findByDoctorIdAndStatus(doctorId, "CONFIRMED");
        for (Appointment a : active) {
            if (a.getTokenNumber().equals(tokenNumber)) {
                a.setStatus("SKIPPED");
                appointmentRepository.save(a);
            }
        }
    }
}
