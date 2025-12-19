package com.utkarshhh.repository;

import com.utkarshhh.modal.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    // Changed from Long to ObjectId
}