package com.quizhub.quizhub.controller;


import com.quizhub.quizhub.model.User;
import com.quizhub.quizhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("all-users")
    public ResponseEntity<?> getAllUsers() {
        List<User> all = userService.getAll();
        if(all != null && !all.isEmpty()){
            return new ResponseEntity<>(all, HttpStatus.OK);

        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/create-new-admin")
    public void createUser(@RequestBody User user){
        userService.saveAdmin(user);
    }

    @DeleteMapping("/delete-user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        boolean deleted = userService.deleteUserById(userId);
        if (deleted) {
            return ResponseEntity.ok("User with ID " + userId + " deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + userId + " not found.");
        }
    }
}
