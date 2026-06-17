package com.smartcare.controller;

import com.smartcare.model.Queue;
import com.smartcare.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @GetMapping
    public ResponseEntity<List<Queue>> getQueueStatus() {
        return ResponseEntity.ok(queueService.getLiveQueueStatus());
    }

    @PutMapping("/next")
    public ResponseEntity<Queue> callNext(@RequestBody Map<String, Long> payload) {
        Long doctorId = payload.get("doctorId");
        return ResponseEntity.ok(queueService.nextPatient(doctorId));
    }

    @PutMapping("/complete")
    public ResponseEntity<Void> completeConsultation(@RequestBody Map<String, Object> payload) {
        Long doctorId = (Long) payload.get("doctorId");
        Integer tokenNumber = (Integer) payload.get("tokenNumber");
        queueService.completeConsultation(doctorId, tokenNumber);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/skip")
    public ResponseEntity<Void> skipPatient(@RequestBody Map<String, Object> payload) {
        Long doctorId = (Long) payload.get("doctorId");
        Integer tokenNumber = (Integer) payload.get("tokenNumber");
        queueService.skipPatient(doctorId, tokenNumber);
        return ResponseEntity.ok().build();
    }
}
