package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.CategoryRequestDTO;
import com.store_management.dtos.CategoryResponseDTO;
import com.store_management.services.CategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> list(
            @RequestHeader("Authorization") String authorization
    ) {
        List<CategoryResponseDTO> data = categoryService.getCategories(authorization);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách danh mục thành công", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> create(
            @Valid @RequestBody CategoryRequestDTO request,
            @RequestHeader("Authorization") String authorization
    ) {
        CategoryResponseDTO data = categoryService.createCategory(request, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Thêm danh mục thành công", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO request,
            @RequestHeader("Authorization") String authorization
    ) {
        CategoryResponseDTO data = categoryService.updateCategory(id, request, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật danh mục thành công", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization
    ) {
        categoryService.deleteCategory(id, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Xóa danh mục thành công", null));
    }
}
