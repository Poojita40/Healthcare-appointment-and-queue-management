package com.smartcare.service;

import com.smartcare.model.User;
import com.smartcare.repository.UserRepository;
import com.smartcare.security.JwtUtil;
import com.smartcare.dto.LoginRequest;
import com.smartcare.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    public User register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists in system database.");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("PATIENT");
        user.setPhone(req.getPhone());
        user.setAge(req.getAge());
        user.setGender(req.getGender());
        user.setAddress(req.getAddress());
        
        User savedUser = userRepository.save(user);
        
        // Send registration confirmation email
        emailService.sendRegistrationConfirmation(savedUser.getEmail(), savedUser.getName());
        
        return savedUser;
    }

    public String login(LoginRequest req) {
        Optional<User> optUser = userRepository.findByEmail(req.getEmail());
        if (optUser.isEmpty() || !passwordEncoder.matches(req.getPassword(), optUser.get().getPassword())) {
            throw new RuntimeException("Invalid username or password credentials.");
        }
        User user = optUser.get();
        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }
}
