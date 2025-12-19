package com.utkarshhh.repository;

import com.utkarshhh.model.Category;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, ObjectId> {

    List<Category> findBySalonId(ObjectId salonId);

    Optional<Category> findByIdAndSalonId(ObjectId id, ObjectId salonId);
}
