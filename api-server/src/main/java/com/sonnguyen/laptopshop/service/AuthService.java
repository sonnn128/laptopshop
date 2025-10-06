package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.RegisterRequest;
import com.sonnguyen.laptopshop.payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(String username, String password);
    void register(RegisterRequest registerRequest);
    User getCurrentUser(String username);
    User updateProfile(String username, RegisterRequest updateRequest);
}
