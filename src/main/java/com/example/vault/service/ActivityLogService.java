package com.example.vault.service;

import com.example.vault.entity.ActivityLog;
import com.example.vault.entity.User;
import com.example.vault.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(User user, String action, String details) {
        ActivityLog log = ActivityLog.builder()
                .user(user)
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getUserActivity(Long userId) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
