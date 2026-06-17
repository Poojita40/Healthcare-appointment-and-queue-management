package com.smartcare.service;

import com.smartcare.model.Doctor;
import com.smartcare.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor profile metadata not found."));
    }

    public Doctor saveDoctor(Doctor d) {
        return doctorRepository.save(d);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
