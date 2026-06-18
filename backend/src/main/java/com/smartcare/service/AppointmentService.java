package com.smartcare.service;

import com.smartcare.model.Appointment;
import com.smartcare.model.Queue;
import com.smartcare.model.Patient;
import com.smartcare.model.Doctor;
import com.smartcare.repository.AppointmentRepository;
import com.smartcare.repository.QueueRepository;
import com.smartcare.repository.PatientRepository;
import com.smartcare.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private EmailService emailService;

    public Appointment bookAppointment(Appointment appt) {
        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTime(appt.getDoctorId(), appt.getAppointmentDate(), appt.getAppointmentTime())) {
            throw new RuntimeException("This time slot is already booked for the selected doctor.");
        }

        // Find or create Doctor's queue
        Queue q = queueRepository.findByDoctorId(appt.getDoctorId())
                .orElseGet(() -> {
                    Queue newQ = new Queue();
                    newQ.setDoctorId(appt.getDoctorId());
                    newQ.setCurrentToken(0);
                    newQ.setNextToken(1);
                    newQ.setEstimatedWaitTime(15);
                    return queueRepository.save(newQ);
                });

        int token = q.getNextToken();
        q.setNextToken(token + 1);
        queueRepository.save(q);

        appt.setTokenNumber(token);
        appt.setStatus("PENDING");
        Appointment savedAppt = appointmentRepository.save(appt);

        // Smart email dispatch - Fetch Patient & Doctor details dynamically 
        String patientEmail = "patient@smartcare.com";
        String patientName = "Valued Patient";
        String doctorName = "SmartCare Specialist Clinician";

        if (savedAppt.getPatientId() != null) {
            Patient patient = patientRepository.findById(savedAppt.getPatientId()).orElse(null);
            if (patient != null) {
                patientEmail = patient.getEmail();
                patientName = patient.getName();
            }
        }

        if (savedAppt.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(savedAppt.getDoctorId()).orElse(null);
            if (doctor != null) {
                doctorName = doctor.getName();
            }
        }

        int currentTokenVal = q.getCurrentToken();
        int patientsAhead = Math.max(0, token - currentTokenVal - 1);
        int estimatedWaitTime = patientsAhead * 15;
        String formattedToken = "SC" + String.format("%03d", token);

        // Send Email Booking Confirmation
        emailService.sendBookingConfirmation(
            patientEmail,
            patientName,
            doctorName,
            savedAppt.getAppointmentDate(),
            savedAppt.getAppointmentTime(),
            formattedToken,
            patientsAhead,
            estimatedWaitTime
        );

        // Fetch Doctor Email (if available, defaulting to mock for now)
        String doctorEmail = "doctor@smartcare.com";
        if (savedAppt.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(savedAppt.getDoctorId()).orElse(null);
            if (doctor != null && doctor.getEmail() != null) {
                doctorEmail = doctor.getEmail();
            }
        }

        // Notify Doctor
        emailService.sendDoctorBookingNotification(
            doctorEmail,
            doctorName,
            patientName,
            savedAppt.getAppointmentDate(),
            savedAppt.getAppointmentTime(),
            formattedToken
        );

        // Notify Admin
        emailService.sendAdminBookingNotification(
            patientName,
            doctorName,
            savedAppt.getAppointmentDate(),
            savedAppt.getAppointmentTime(),
            formattedToken
        );

        return savedAppt;
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found."));
        appt.setStatus(status);
        Appointment saved = appointmentRepository.save(appt);

        // Trigger email notification upon booking cancellation
        if ("CANCELLED".equalsIgnoreCase(status)) {
            String patientEmail = "patient@smartcare.com";
            String patientName = "Valued Patient";
            String doctorName = "SmartCare Specialist Clinician";

            if (saved.getPatientId() != null) {
                Patient patient = patientRepository.findById(saved.getPatientId()).orElse(null);
                if (patient != null) {
                    patientEmail = patient.getEmail();
                    patientName = patient.getName();
                }
            }

            if (saved.getDoctorId() != null) {
                Doctor doctor = doctorRepository.findById(saved.getDoctorId()).orElse(null);
                if (doctor != null) {
                    doctorName = doctor.getName();
                }
            }

            String formattedToken = "SC" + String.format("%03d", saved.getTokenNumber());
            emailService.sendCancellationConfirmation(
                patientEmail,
                patientName,
                doctorName,
                saved.getAppointmentDate(),
                saved.getAppointmentTime(),
                formattedToken
            );
        }

        return saved;
    }

    public Appointment rescheduleAppointment(Long id, LocalDate newDate, String newTime) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found."));
        appt.setAppointmentDate(newDate);
        appt.setAppointmentTime(newTime);
        appt.setStatus("RESCHEDULED");
        Appointment saved = appointmentRepository.save(appt);

        String patientEmail = "patient@smartcare.com";
        String patientName = "Valued Patient";
        String doctorName = "SmartCare Specialist Clinician";

        if (saved.getPatientId() != null) {
            Patient patient = patientRepository.findById(saved.getPatientId()).orElse(null);
            if (patient != null) {
                patientEmail = patient.getEmail();
                patientName = patient.getName();
            }
        }

        if (saved.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(saved.getDoctorId()).orElse(null);
            if (doctor != null) {
                doctorName = doctor.getName();
            }
        }

        String formattedToken = "SC" + String.format("%03d", saved.getTokenNumber());
        emailService.sendRescheduleConfirmation(
            patientEmail,
            patientName,
            doctorName,
            saved.getAppointmentDate(),
            saved.getAppointmentTime(),
            formattedToken
        );

        return saved;
    }
}
