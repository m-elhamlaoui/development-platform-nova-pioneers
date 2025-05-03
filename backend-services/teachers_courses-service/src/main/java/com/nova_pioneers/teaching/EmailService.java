package com.nova_pioneers.teaching;

import org.springframework.beans.factory.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.*;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${nova.contact.recipient}")
    private String contactRecipient;

    public void sendContactEmail(ContactMessage contactMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(contactRecipient);
        message.setSubject("Contact Form: " + contactMessage.getSubject());
        message.setText(
                "Name: " + contactMessage.getName() + "\n" +
                        "Email: " + contactMessage.getEmail() + "\n\n" +
                        contactMessage.getMessage()
        );

        mailSender.send(message);
    }
}
