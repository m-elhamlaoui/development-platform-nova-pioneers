package com.nova_pioneers.parenting.model;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Registerkid{
    @Id
    @GeneratedValue( strategy= GenerationType.AUTO)
  @CreationTimestamp

    private Long user_id;
    private String email;
    private String password_hash;
    private String first_name ;
    private String last_name;
    private String role;
    private OffsetDateTime created_at;
    private Boolean is_active;
    private String oauth_provider;
    private  Integer  oauth_id;
   
    

   
    public Long getUser_id() {
        return user_id;
    }

    
    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    
    public String getEmail() {
        return email;
    }

    
    public void setEmail(String email) {
        this.email = email;
    }

    
    public String getPassword_hash() {
        return password_hash;
    }

    
    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

   
    public String getFirst_name() {
        return first_name;
    }

   
    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

   
    public String getLast_name() {
        return last_name;
    }

   
    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    
    public String getRole() {
        return role;
    }

    
    public void setRole(String role) {
        this.role = role;
    }

    
    public OffsetDateTime getCreated_at() {
        return created_at;
    }

    
    public void setCreated_at(OffsetDateTime created_at) {
        this.created_at = created_at;
    }

   
    public Boolean isIs_active() {
        return is_active;
    }

    
    public void setIs_active(Boolean is_active) {
        this.is_active = is_active;
    }

   
    public String getOauth_provider() {
        return oauth_provider;
    }

    
    public void setOauth_provider(String oauth_provider) {
        this.oauth_provider = oauth_provider;
    }

    
    public Integer getOauth_id() {
        return oauth_id;
    }

    
    public void setOauth_id(Integer oauth_id) {
        this.oauth_id = oauth_id;
    }

}