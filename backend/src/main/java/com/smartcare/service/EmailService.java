package com.smartcare.service;

import com.smartcare.model.SimulatedEmail;
import com.smartcare.repository.SimulatedEmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private SimulatedEmailRepository simulatedEmailRepository;

    public void sendQueueAlert(String toEmail, Integer tokenNumber) {
        System.out.println("SMTP Alert Successfully Sent! Destination: " + toEmail + " | Assigned Token: " + tokenNumber);
        String subject = "Queue Alert: Token " + tokenNumber;
        String body = "Your token number is " + tokenNumber + ". Please wait for your turn.";
        simulatedEmailRepository.save(new SimulatedEmail(toEmail, subject, body, "queue-alert"));
    }

    public void sendBookingConfirmation(String toEmail, String patientName, String doctorName, LocalDate date, String time, String tokenNumber, int patientsAhead, int estimatedWaitTime) {
        String waitTimeText = estimatedWaitTime == 0 
            ? "Immediate (You are next in queue!)" 
            : estimatedWaitTime + " mins (" + patientsAhead + " patients ahead of you)";

        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - BOOKING CONFIRMED]");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: SmartCare Appointment Confirmation: " + doctorName + " [Token: " + tokenNumber + "]");
        System.out.println("Body:");
        System.out.println("Dear " + patientName + ",\n");
        System.out.println("Your booking at SmartCare Hospital has been successfully confirmed.");
        System.out.println("Appointment Details:");
        System.out.println("- Doctor: " + doctorName);
        System.out.println("- Date: " + date);
        System.out.println("- Time Slot: " + time);
        System.out.println("\nQUEUE TRACKING DETAILS:");
        System.out.println("- Your Assigned Token Number: " + tokenNumber);
        System.out.println("- Patients Ahead: " + patientsAhead);
        System.out.println("- Estimated Wait Time: " + waitTimeText);
        System.out.println("\nThank you for choosing SmartCare for your healthcare requirements!");
        System.out.println("==================================================\n");
        
        String subject = "SmartCare Appointment Confirmation: " + doctorName + " [Token: " + tokenNumber + "]";
        String body = "Dear " + patientName + ",\nYour booking at SmartCare Hospital has been successfully confirmed.\nAppointment Details:\n- Doctor: " + doctorName + "\n- Date: " + date + "\n- Time Slot: " + time + "\n\nQUEUE TRACKING DETAILS:\n- Your Assigned Token Number: " + tokenNumber + "\n- Patients Ahead: " + patientsAhead + "\n- Estimated Wait Time: " + waitTimeText;
        simulatedEmailRepository.save(new SimulatedEmail(toEmail, subject, body, "booking"));
    }

    public void sendCancellationConfirmation(String toEmail, String patientName, String doctorName, LocalDate date, String time, String tokenNumber) {
        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - APPOINTMENT CANCELLED]");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Appointment Cancelled: " + doctorName + " [Token: " + tokenNumber + "]");
        System.out.println("Body:");
        System.out.println("Dear " + patientName + ",\n");
        System.out.println("This is to confirm that your scheduled appointment with " + doctorName + " at SmartCare Hospital has been successfully cancelled as per request.");
        System.out.println("Cancelled Appointment Details:");
        System.out.println("- Doctor: " + doctorName);
        System.out.println("- Scheduled Date: " + date);
        System.out.println("- Scheduled Time Slot: " + time);
        System.out.println("- Released Token Number: " + tokenNumber);
        System.out.println("\nIf this cancellation was done in error or if you wish to reschedule, please visit our online patient portal.");
        System.out.println("==================================================\n");
        
        String subject = "Appointment Cancelled: " + doctorName + " [Token: " + tokenNumber + "]";
        String body = "Dear " + patientName + ",\nThis is to confirm that your scheduled appointment with " + doctorName + " at SmartCare Hospital has been successfully cancelled as per request.\nCancelled Appointment Details:\n- Doctor: " + doctorName + "\n- Scheduled Date: " + date + "\n- Scheduled Time Slot: " + time + "\n- Released Token Number: " + tokenNumber;
        simulatedEmailRepository.save(new SimulatedEmail(toEmail, subject, body, "cancellation"));
    }

    public void sendRescheduleConfirmation(String toEmail, String patientName, String doctorName, LocalDate newDate, String newTime, String tokenNumber) {
        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - RESCHEDULED]");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Appointment Rescheduled: " + doctorName + " [Token: " + tokenNumber + "]");
        System.out.println("Body:");
        System.out.println("Dear " + patientName + ",\n");
        System.out.println("Your appointment with " + doctorName + " at SmartCare Hospital has been successfully RESCHEDULED.");
        System.out.println("New Appointment Details:");
        System.out.println("- Doctor: " + doctorName);
        System.out.println("- New Date: " + newDate);
        System.out.println("- New Time Slot: " + newTime);
        System.out.println("- Token Number: " + tokenNumber);
        System.out.println("\nPlease arrive 10 minutes prior to your new slot.");
        System.out.println("==================================================\n");
        
        String subject = "Appointment Rescheduled: " + doctorName + " [Token: " + tokenNumber + "]";
        String body = "Dear " + patientName + ",\nYour appointment with " + doctorName + " at SmartCare Hospital has been successfully RESCHEDULED.\nNew Appointment Details:\n- Doctor: " + doctorName + "\n- New Date: " + newDate + "\n- New Time Slot: " + newTime + "\n- Token Number: " + tokenNumber;
        simulatedEmailRepository.save(new SimulatedEmail(toEmail, subject, body, "reschedule"));
    }

    public void sendDoctorBookingNotification(String doctorEmail, String doctorName, String patientName, LocalDate date, String time, String tokenNumber) {
        String subject = "New Appointment Scheduled: " + patientName + " [Token: " + tokenNumber + "]";
        String body = String.format(
            "Dear Dr. %s,\n\nA new appointment has been booked for you.\n\n" +
            "Details:\nPatient: %s\nDate: %s\nTime: %s\nToken: %s\n\n" +
            "--\nSmartCare Automated System",
            doctorName, patientName, date, time, tokenNumber
        );

        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - DOCTOR BOOKING NOTIFICATION]");
        System.out.println("To: " + doctorEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
        System.out.println("==================================================\n");
        
        simulatedEmailRepository.save(new SimulatedEmail(doctorEmail, subject, body, "doctor-notification"));
    }

    public void sendAdminBookingNotification(String patientName, String doctorName, LocalDate date, String time, String tokenNumber) {
        String subject = "System Alert: New Appointment Booking [Token: " + tokenNumber + "]";
        String body = String.format(
            "Admin Alert:\nA new appointment was successfully booked in the system.\n\n" +
            "Details:\nPatient: %s\nDoctor: %s\nDate: %s\nTime: %s\nToken: %s\n\n" +
            "--\nSmartCare Automated System",
            patientName, doctorName, date, time, tokenNumber
        );

        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - ADMIN BOOKING NOTIFICATION]");
        System.out.println("To: admin@smartcare.com");
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
        System.out.println("==================================================\n");
        
        simulatedEmailRepository.save(new SimulatedEmail("admin@smartcare.com", subject, body, "admin-notification"));
    }

    public void sendRegistrationConfirmation(String userEmail, String userName) {
        String subject = "Welcome to SmartCare - Registration Successful";
        String body = String.format(
            "Dear %s,\n\nWelcome to SmartCare! Your registration was successful.\n" +
            "You can now log in to the portal to book appointments, view your queue status, and consult with our specialists.\n\n" +
            "Thank you for choosing SmartCare.\n\n" +
            "--\nSmartCare Automated System",
            userName
        );

        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - REGISTRATION CONFIRMATION]");
        System.out.println("To: " + userEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
        System.out.println("==================================================\n");
        
        simulatedEmailRepository.save(new SimulatedEmail(userEmail, subject, body, "registration"));
    }

    public void sendContactInquiryNotification(com.smartcare.dto.ContactRequestDTO contactRequest) {
        String subject = "New Contact Inquiry: " + contactRequest.getSubject();
        String body = String.format(
            "You have received a new contact inquiry via the SmartCare Portal.\n\n" +
            "Details:\n" +
            "Name: %s\n" +
            "Email: %s\n\n" +
            "Message:\n%s\n\n" +
            "--\nSmartCare Automated System",
            contactRequest.getName(),
            contactRequest.getEmail(),
            contactRequest.getMessage()
        );

        System.out.println("\n==================================================");
        System.out.println("[JAVA SPRING BOOT SMTP - ADMIN CONTACT NOTIFICATION]");
        System.out.println("To: admin@smartcare.com");
        System.out.println("Subject: " + subject);
        System.out.println("Body:");
        System.out.println(body);
        System.out.println("==================================================\n");
        
        simulatedEmailRepository.save(new SimulatedEmail("admin@smartcare.com", subject, body, "contact"));
    }
}
