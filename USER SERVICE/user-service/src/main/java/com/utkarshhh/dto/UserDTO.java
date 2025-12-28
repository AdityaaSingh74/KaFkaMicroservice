package com.utkarshhh.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
}