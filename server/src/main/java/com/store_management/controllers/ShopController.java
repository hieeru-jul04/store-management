package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.ShopRequestDTO;
import com.store_management.dtos.ShopResponseDTO;
import com.store_management.services.ShopService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/settings")
public class ShopController {
    private final ShopService shopService;

    @GetMapping
    public ResponseEntity<ApiResponse<ShopResponseDTO>> getSettings(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy thiết lập thành công", shopService.getShop(authorization)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ShopResponseDTO>> updateSettings(@RequestBody ShopRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thiết lập thành công", shopService.updateShop(request, authorization)));
    }
}
