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
    public ResponseEntity<Queue> callNext(@RequestBody Map<String, Object> payload) {
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());
        return ResponseEntity.ok(queueService.nextPatient(doctorId));
    }

    @PutMapping("/complete")
    public ResponseEntity<Void> completeConsultation(@RequestBody Map<String, Object> payload) {
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());
        Integer tokenNumber = Integer.valueOf(payload.get("tokenNumber").toString());
        queueService.completeConsultation(doctorId, tokenNumber);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/skip")
    public ResponseEntity<Void> skipPatient(@RequestBody Map<String, Object> payload) {
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());
        Integer tokenNumber = Integer.valueOf(payload.get("tokenNumber").toString());
        queueService.skipPatient(doctorId, tokenNumber);
        return ResponseEntity.ok().build();
    }
}
