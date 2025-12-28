package com.utkarshhh.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private ObjectId id;
    private String name;
    private String description;
    private int price;
    private int duration;
    private ObjectId salonId;
    private ObjectId categoryId;
    private String image;
}