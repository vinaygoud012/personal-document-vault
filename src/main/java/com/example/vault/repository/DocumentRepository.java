package com.example.vault.repository;

import com.example.vault.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Long userId);

    List<Document> findByUserIdAndNameContainingIgnoreCase(Long userId, String name);
}
