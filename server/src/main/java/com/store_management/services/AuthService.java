package com.store_management.services;

import com.store_management.dtos.AuthResponseDTO;
import com.store_management.dtos.LoginRequestDTO;
import com.store_management.dtos.RegisterRequestDTO;
import com.store_management.dtos.UserResponseDTO;
import com.store_management.entities.Shop;
import com.store_management.entities.User;
import com.store_management.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Shop getShopByToken(String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            Long userId = Long.parseLong(decoded.split(":")[0]);
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Unauthorized"));
            return user.getShop();
        } catch (Exception e) {
            throw new RuntimeException("Unauthorized");
        }
    }

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Tên đăng nhập đã được sử dụng");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Shop shop = new Shop();
        shop.setName(request.getShopName());

        user.setShop(shop);
        shop.setUser(user);

        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        return buildAuthResponse(user);
    }

    private AuthResponseDTO buildAuthResponse(User user) {
        String token = Base64.getEncoder().encodeToString(
                (user.getId() + ":" + UUID.randomUUID()).getBytes(StandardCharsets.UTF_8)
        );
        return new AuthResponseDTO(UserResponseDTO.from(user), token);
    }
}
