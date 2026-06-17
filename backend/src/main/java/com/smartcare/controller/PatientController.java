package com.smartcare.controller;

import com.smartcare.model.Patient;
import com.smartcare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updateProfile(@PathVariable Long id, @RequestBody Patient updated) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient entry not registered."));
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setAddress(updated.getAddress());
        return ResponseEntity.ok(patientRepository.save(existing));
    }
}
