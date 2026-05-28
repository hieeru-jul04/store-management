package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.ProductRequestDTO;
import com.store_management.dtos.ProductResponseDTO;
import com.store_management.services.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> list(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách thành công", productService.getProducts(authorization)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDTO>> create(@RequestBody ProductRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Tạo sản phẩm thành công", productService.createProduct(request, authorization)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> update(@PathVariable Long id, @RequestBody ProductRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", productService.updateProduct(id, request, authorization)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, @RequestHeader("Authorization") String authorization) {
        productService.deleteProduct(id, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Xóa thành công", null));
    }
}
