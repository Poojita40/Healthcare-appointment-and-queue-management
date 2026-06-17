package com.smartcare.controller;

import com.smartcare.dto.ContactRequestDTO;
import com.smartcare.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitContactInquiry(@Valid @RequestBody ContactRequestDTO request) {
        emailService.sendContactInquiryNotification(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Your inquiry has been successfully sent. We will get back to you shortly.");
        
        return ResponseEntity.ok(response);
    }
}
