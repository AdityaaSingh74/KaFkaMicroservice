package com.utkarshhh.service;

import com.utkarshhh.model.Category;
import org.bson.types.ObjectId;

import java.util.List;

public interface CategoryService {

    Category saveCategory(Category category);

    List<Category> getCategoriesBySalonId(ObjectId salonId);

    Category getCategoryById(ObjectId categoryId);

    void deleteCategory(ObjectId categoryId, ObjectId salonId);
}
