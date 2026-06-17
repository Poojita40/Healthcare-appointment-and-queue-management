package com.smartcare.config;

import com.smartcare.model.Doctor;
import com.smartcare.model.User;
import com.smartcare.repository.DoctorRepository;
import com.smartcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // ── Users ──────────────────────────────────────────────────────────
        if (userRepository.findByEmail("admin@smartcare.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@smartcare.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded Admin: admin@smartcare.com");
        }

        if (userRepository.findByEmail("patient@smartcare.com").isEmpty()) {
            User patient = new User();
            patient.setName("Demo Patient");
            patient.setEmail("patient@smartcare.com");
            patient.setPassword(passwordEncoder.encode("password123"));
            patient.setRole("PATIENT");
            userRepository.save(patient);
        }

        seedDoctorUser("Dr. Arvind Sharma", "arvind.sharma@smartcare.com");
        seedDoctorUser("Dr. Meera Nair", "meera.nair@smartcare.com");
        seedDoctorUser("Dr. Rajesh K.", "rajesh.k@smartcare.com");
        seedDoctorUser("Dr. Sarah D'Souza", "sarah.dsouza@smartcare.com");
        seedDoctorUser("Dr. Amit Verma", "amit.verma@smartcare.com");
        seedDoctorUser("Dr. Priya Patel", "priya.patel@smartcare.com");

        // ── Doctors ────────────────────────────────────────────────────────
        if (doctorRepository.count() == 0) {
            seedDoctor("Dr. Arvind Sharma", "Cardiology", "MD, DM (Cardiology) - AIIMS", "15 Years", "arvind.sharma@smartcare.com", "9876543210", "Mon, Wed, Fri (9:00 AM - 1:00 PM)");
            seedDoctor("Dr. Meera Nair", "Pediatrics", "MBBS, DCH, MD (Pediatrics)", "12 Years", "meera.nair@smartcare.com", "9876543211", "Tue, Thu, Sat (10:00 AM - 3:00 PM)");
            seedDoctor("Dr. Rajesh K.", "Orthopedics", "MS (Orthopedics), M.Ch (Joint Replacement)", "18 Years", "rajesh.k@smartcare.com", "9876543212", "Mon to Fri (2:00 PM - 6:00 PM)");
            seedDoctor("Dr. Sarah D'Souza", "Dermatology", "MD, DNB (Dermatology)", "9 Years", "sarah.dsouza@smartcare.com", "9876543213", "Wed, Thu, Sat (4:00 PM - 8:00 PM)");
            seedDoctor("Dr. Amit Verma", "General Physician", "MD (Medicine)", "14 Years", "amit.verma@smartcare.com", "9876543214", "Mon to Sat (9:00 AM - 5:00 PM)");
            seedDoctor("Dr. Priya Patel", "Neurology", "MD, DM (Neurology)", "11 Years", "priya.patel@smartcare.com", "9876543215", "Tue, Fri (1:00 PM - 5:00 PM)");
            System.out.println("Seeded original 6 doctors successfully.");
        }
    }

    private void seedDoctorUser(String name, String email) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User doc = new User();
            doc.setName(name);
            doc.setEmail(email);
            doc.setPassword(passwordEncoder.encode("password123"));
            doc.setRole("DOCTOR");
            userRepository.save(doc);
        }
    }

    private void seedDoctor(String name, String specialization, String qualification,
                             String experience, String email, String phone, String availability) {
        Doctor d = new Doctor();
        d.setName(name);
        d.setSpecialization(specialization);
        d.setQualification(qualification);
        d.setExperience(experience);
        d.setEmail(email);
        d.setPhone(phone);
        d.setAvailability(availability);
        doctorRepository.save(d);
    }
}
