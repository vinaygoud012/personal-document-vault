package com.example.vault.service;

import com.example.vault.entity.Document;
import com.example.vault.entity.User;
import com.example.vault.repository.DocumentRepository;
import com.example.vault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public Document store(MultipartFile file, Long userId, String tags) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Document doc = Document.builder()
                .name(fileName)
                .type(file.getContentType())
                .size(file.getSize())
                .data(file.getBytes()) // In a real app, encrypt here
                .uploadDate(LocalDateTime.now())
                .tags(tags)
                .user(user)
                .encrypted(true) // Mocking encryption status
                .build();

        Document savedDoc = documentRepository.save(doc);
        activityLogService.logActivity(user, "UPLOAD", "Uploaded document: " + fileName);
        return savedDoc;
    }

    public Document getFile(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found with id " + id));
    }

    public List<Document> getAllFiles(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    public void deleteFile(Long id, Long userId) {
        Document doc = getFile(id);
        if (!doc.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this file");
        }
        documentRepository.delete(doc);
        activityLogService.logActivity(doc.getUser(), "DELETE", "Deleted document: " + doc.getName());
    }
}
