package com.utkarshhh.controller;

import com.utkarshhh.modal.User;
import com.utkarshhh.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;


@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/users")
    public User createUser(@RequestBody User user){
        return userRepository.save(user);
    }
    @GetMapping("/api/users")
    public List<User> getUser(){
        return userRepository.findAll();
    }

    @GetMapping("/api/users/{id}")
    public User getUserById(@PathVariable ObjectId id) throws Exception {
        Optional<User> otp = userRepository.findById(id);
        if(otp.isPresent()){
            return otp.get();
        }
        else {
            throw new Exception("User not found");
        }
    }

    @PutMapping("/api/users/{id}")
    public User updateUser(@RequestBody User user,@PathVariable ObjectId id) throws Exception {
        Optional<User> otp = userRepository.findById(id);
        if(otp.isEmpty())
        {
            throw new Exception("user not found with if: "+id);
        }
        User existingUser = otp.get();
        existingUser.setEmail(user.getEmail());
        existingUser.setFullName(user.getFullName());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }

    @DeleteMapping("/api/users/{id}")
    public String deleteUserById(@PathVariable String id) throws Exception {
        ObjectId objectId = new ObjectId(id); // throws IllegalArgumentException if invalid
        Optional<User> otp = userRepository.findById(objectId);
        if (otp.isEmpty()) {
            throw new Exception("User not found with id: " + id);
        }
        userRepository.deleteById(objectId);
        return "User deleted successfully";
    }
}
