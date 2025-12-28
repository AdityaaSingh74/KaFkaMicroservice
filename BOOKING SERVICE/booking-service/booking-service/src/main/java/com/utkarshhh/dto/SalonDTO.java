package com.utkarshhh.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalonDTO {
    private ObjectId id;
    private String name;
    private List<String> images;
    private String address;
    private String phoneNumber;  // ✅ Must be phoneNumber, not phone!
    private String email;
    private String city;
    private Long ownerId;        // ✅ Long, not ObjectId!
    private LocalTime openTime;
    private LocalTime closeTime;
}