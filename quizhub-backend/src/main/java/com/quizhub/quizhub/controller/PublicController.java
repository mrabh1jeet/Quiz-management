
package com.quizhub.quizhub.controller;

import com.quizhub.quizhub.Utilis.JwtUtil;
import com.quizhub.quizhub.model.User;
import com.quizhub.quizhub.repository.UserRepository;
import com.quizhub.quizhub.service.UserDetailsServiceImpl;
import com.quizhub.quizhub.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value="/public")
@Slf4j
@Tag(name = "Public APIs")
public class PublicController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    //Create User register[]
    @PostMapping("/create-user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(201).body(createdUser); // HTTP 201 CREATED
    }

//  login[]
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String jwt = jwtUtil.generateToken(userDetails.getUsername());
            // Here, you would also retrieve the user id, e.g., from your User repository.
            Long userId = userRepository.findByUsername(user.getUsername()).get().getId();
            String userRole = String.valueOf(userRepository.findByUsername(user.getUsername()).get().getRole());
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", jwt);
            responseBody.put("userId", userId);
            responseBody.put("username", user.getUsername());
            responseBody.put("role", userRole);
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch (Exception e){
            log.error("Exception occurred while creating AuthenticationToken", e);
            return new ResponseEntity<>("Incorrect Username or Password", HttpStatus.BAD_REQUEST);
        }
    }

}