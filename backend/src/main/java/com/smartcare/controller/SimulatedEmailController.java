package com.smartcare.controller;

import com.smartcare.model.SimulatedEmail;
import com.smartcare.repository.SimulatedEmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/simulated-emails")
public class SimulatedEmailController {

    @Autowired
    private SimulatedEmailRepository simulatedEmailRepository;

    @GetMapping
    public List<SimulatedEmail> getSimulatedEmails(@RequestParam("email") String email) {
        return simulatedEmailRepository.findByToOrderBySentAtDesc(email);
    }
}
