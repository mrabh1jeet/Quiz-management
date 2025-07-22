package com.quizhub.quizhub.controller;

import com.quizhub.quizhub.model.User;
import com.quizhub.quizhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired UserService userService;



//    //Get All Users
//    @GetMapping
//    public ResponseEntity<List<User>> getAllUsers() {
//        List<User> users = userService.getAllUsers();
//        return ResponseEntity.ok(users); // HTTP 200 OK
//    }

//    //Get User by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<User> getUserById(@PathVariable Long id) {
//        User user = userService.getUserById(id);
//        return ResponseEntity.ok(user); // HTTP 200 OK
//    }

    //Update User
    @PutMapping()
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        // Retrieve the authenticated username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();

        // Call the service layer to update the user
        User updatedUser = userService.updateUser(userName, user);

        return ResponseEntity.ok(updatedUser); // HTTP 200 OK
    }

    //Delete User
    @DeleteMapping()
    public ResponseEntity<Void> deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        userService.deleteUser(userName);
        return ResponseEntity.noContent().build(); // HTTP 204 NO CONTENT
    }
}
