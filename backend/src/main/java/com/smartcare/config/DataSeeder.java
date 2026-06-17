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

        if (userRepository.findByEmail("arvind.sharma@smartcare.com").isEmpty()) {
            User doc1 = new User();
            doc1.setName("Dr. Arvind Sharma");
            doc1.setEmail("arvind.sharma@smartcare.com");
            doc1.setPassword(passwordEncoder.encode("password123"));
            doc1.setRole("DOCTOR");
            userRepository.save(doc1);
        }

        if (userRepository.findByEmail("priya.patel@smartcare.com").isEmpty()) {
            User doc2 = new User();
            doc2.setName("Dr. Priya Patel");
            doc2.setEmail("priya.patel@smartcare.com");
            doc2.setPassword(passwordEncoder.encode("password123"));
            doc2.setRole("DOCTOR");
            userRepository.save(doc2);
        }

        if (userRepository.findByEmail("patient@smartcare.com").isEmpty()) {
            User patient = new User();
            patient.setName("Demo Patient");
            patient.setEmail("patient@smartcare.com");
            patient.setPassword(passwordEncoder.encode("password123"));
            patient.setRole("PATIENT");
            userRepository.save(patient);
        }

        // ── Doctors ────────────────────────────────────────────────────────
        if (doctorRepository.count() == 0) {
            seedDoctor("Dr. Arvind Sharma",   "Cardiology",       "MBBS, MD",       "12 years",  "arvind.sharma@smartcare.com",  "+91-9000000001", "Mon-Fri 9am-5pm");
            seedDoctor("Dr. Priya Patel",     "Dermatology",      "MBBS, MD",       "8 years",   "priya.patel@smartcare.com",    "+91-9000000002", "Mon-Sat 10am-4pm");
            seedDoctor("Dr. Rajan Mehta",     "Neurology",        "MBBS, DM",       "15 years",  "rajan.mehta@smartcare.com",    "+91-9000000003", "Tue-Sat 11am-6pm");
            seedDoctor("Dr. Sunita Rao",      "Pediatrics",       "MBBS, DCH",      "10 years",  "sunita.rao@smartcare.com",     "+91-9000000004", "Mon-Fri 8am-3pm");
            seedDoctor("Dr. Vikram Singh",    "Orthopedics",      "MBBS, MS",       "20 years",  "vikram.singh@smartcare.com",   "+91-9000000005", "Mon-Thu 9am-5pm");
            seedDoctor("Dr. Ananya Krishnan", "Gynecology",       "MBBS, MS",       "11 years",  "ananya.krishnan@smartcare.com","+91-9000000006", "Mon-Fri 10am-5pm");
            seedDoctor("Dr. Rohan Gupta",     "Ophthalmology",    "MBBS, MS",       "7 years",   "rohan.gupta@smartcare.com",    "+91-9000000007", "Mon-Sat 9am-2pm");
            seedDoctor("Dr. Meera Joshi",     "ENT",              "MBBS, MS",       "9 years",   "meera.joshi@smartcare.com",    "+91-9000000008", "Tue-Sat 10am-5pm");
            System.out.println("Seeded 8 doctors successfully.");
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
