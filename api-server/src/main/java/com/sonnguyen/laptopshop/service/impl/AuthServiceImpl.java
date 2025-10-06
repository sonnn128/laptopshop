package com.sonnguyen.laptopshop.service.impl;

import com.sonnguyen.laptopshop.config.JwtService;
import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Role;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.RegisterRequest;
import com.sonnguyen.laptopshop.payload.response.AuthResponse;
import com.sonnguyen.laptopshop.repository.RoleRepository;
import com.sonnguyen.laptopshop.repository.UserRepository;
import com.sonnguyen.laptopshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Value("${jwt.EXPIRATION_TIME:3600000}")
    private int JWT_EXPIRATION_TIME;
    @Value("${jwt.EXPIRATION_TIME_REMEMBER_ME:3600000}")
    private int JWT_EXPIRATION_TIME_REMEMBER_ME;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public AuthResponse login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal(), JWT_EXPIRATION_TIME);
        User user = userRepository.findByUsername(username);
        return new AuthResponse(token, user);
    }

    @Override
    @Transactional
    public void register(RegisterRequest registerRequest) {
        User existingUser = userRepository.findByUsername(registerRequest.getUsername());
        if (existingUser != null) {
            throw new CommonException("username exist", HttpStatus.CONFLICT);
        }
        
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setGender(registerRequest.getGender());
        
        // Assign USER role by default
        Role userRole = roleRepository.findById("USER")
                .orElseThrow(() -> new CommonException("USER role not found", HttpStatus.INTERNAL_SERVER_ERROR));
        user.setRoles(Set.of(userRole));
        
        userRepository.save(user);
    }

    @Override
    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional
    public User updateProfile(String username, RegisterRequest updateRequest) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new CommonException("User not found", HttpStatus.NOT_FOUND);
        }
        
        user.setEmail(updateRequest.getEmail());
        user.setFullName(updateRequest.getFullName());
        user.setPhone(updateRequest.getPhone());
        user.setAddress(updateRequest.getAddress());
        user.setGender(updateRequest.getGender());
        
        return userRepository.save(user);
    }
}

