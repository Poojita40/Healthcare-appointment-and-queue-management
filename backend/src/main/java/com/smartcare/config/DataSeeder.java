package com.smartcare.config;

import com.smartcare.model.User;
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
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        if (userRepository.findByEmail("admin@smartcare.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@smartcare.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded Admin User: admin@smartcare.com");
        }

        // Seed Doctor 1
        if (userRepository.findByEmail("arvind.sharma@smartcare.com").isEmpty()) {
            User doc1 = new User();
            doc1.setName("Dr. Arvind Sharma");
            doc1.setEmail("arvind.sharma@smartcare.com");
            doc1.setPassword(passwordEncoder.encode("password123"));
            doc1.setRole("DOCTOR");
            userRepository.save(doc1);
            System.out.println("Seeded Doctor User: arvind.sharma@smartcare.com");
        }

        // Seed Doctor 2
        if (userRepository.findByEmail("priya.patel@smartcare.com").isEmpty()) {
            User doc2 = new User();
            doc2.setName("Dr. Priya Patel");
            doc2.setEmail("priya.patel@smartcare.com");
            doc2.setPassword(passwordEncoder.encode("password123"));
            doc2.setRole("DOCTOR");
            userRepository.save(doc2);
            System.out.println("Seeded Doctor User: priya.patel@smartcare.com");
        }
        
        // Seed Patient
        if (userRepository.findByEmail("patient@smartcare.com").isEmpty()) {
            User patient = new User();
            patient.setName("Demo Patient");
            patient.setEmail("patient@smartcare.com");
            patient.setPassword(passwordEncoder.encode("password123"));
            patient.setRole("PATIENT");
            userRepository.save(patient);
            System.out.println("Seeded Demo Patient: patient@smartcare.com");
        }
    }
}
