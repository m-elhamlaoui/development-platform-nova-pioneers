package com.nova_pioneers.auth.services;

import com.nova_pioneers.auth.dto.ParentSignupRequest;
import com.nova_pioneers.auth.dto.TeacherSignupRequest;
import com.nova_pioneers.auth.entities.User;
import com.nova_pioneers.auth.entities.VerificationDocument;
import com.nova_pioneers.auth.exceptions.EmailAlreadyExistsException;
import com.nova_pioneers.auth.repositories.UserRepository;
import com.nova_pioneers.auth.repositories.VerificationDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Service
public class SignupService {
    private final UserRepository userRepository;
    private final VerificationDocumentRepository documentRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SignupService(UserRepository userRepository,
                         VerificationDocumentRepository documentRepository,
                         FileStorageService fileStorageService,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerParent(ParentSignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("parent");
        user.setActive(true);  // Parents are active immediately
        user.setCreatedAt(new Date());

        return userRepository.save(user);
    }

    @Transactional
    public User registerTeacher(TeacherSignupRequest request, MultipartFile document) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("teacher");
        user.setActive(false);  // Teachers need verification
        user.setCreatedAt(new Date());

        user = userRepository.save(user);

        // Process document if provided
        if (document != null && !document.isEmpty()) {
            String filePath = fileStorageService.storeFile(document, user.getId());

            VerificationDocument verificationDoc = new VerificationDocument();
            verificationDoc.setUser(user);
            verificationDoc.setDocumentPath(filePath);
            verificationDoc.setApproved(false);

            documentRepository.save(verificationDoc);
        }

        return user;
    }
}
