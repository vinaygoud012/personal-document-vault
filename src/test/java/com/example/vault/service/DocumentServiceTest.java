package com.example.vault.service;

import com.example.vault.entity.Document;
import com.example.vault.entity.User;
import com.example.vault.repository.DocumentRepository;
import com.example.vault.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private DocumentService documentService;

    @Test
    void storeFile_Success() throws IOException {
        // Arrange
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "Hello, World!".getBytes());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Document savedDoc = documentService.store(file, userId, "test");

        // Assert
        assertNotNull(savedDoc);
        assertEquals("test.txt", savedDoc.getName());
        assertEquals("test", savedDoc.getTags());
        verify(activityLogService, times(1)).logActivity(any(User.class), eq("UPLOAD"), anyString());
    }
}
