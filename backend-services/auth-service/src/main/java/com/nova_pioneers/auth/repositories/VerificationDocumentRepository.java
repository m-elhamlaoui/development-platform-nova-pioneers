package com.nova_pioneers.auth.repositories;

import com.nova_pioneers.auth.entities.User;
import com.nova_pioneers.auth.entities.VerificationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationDocumentRepository extends JpaRepository<VerificationDocument, Long> {
    List<VerificationDocument> findByUser(User user);
}
