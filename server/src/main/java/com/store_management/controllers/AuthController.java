package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.AuthResponseDTO;
import com.store_management.dtos.LoginRequestDTO;
import com.store_management.dtos.RegisterRequestDTO;
import com.store_management.services.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(
            @Valid @RequestBody RegisterRequestDTO request
    ) {
        AuthResponseDTO data = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký thành công", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request
    ) {
        AuthResponseDTO data = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", data));
    }
}
