package com.utkarshhh.modal;

import com.mongodb.lang.NonNull;
import jdk.jfr.DataAmount;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(collection = "users")
public class User {

    @Id
    private ObjectId id;
    @NonNull
    private String fullName;
    @NonNull
    private String email;
    @NonNull
    private String phone;
    @NonNull
    private String role;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updateAt;

    public User(){

    }

    public User(LocalDateTime createdAt,
                String fullName,
                String email,
                String phone,
                String role,
                LocalDateTime updateAt) {
        this.createdAt = createdAt;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.updateAt = updateAt;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }

}
