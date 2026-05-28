package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.CustomerRequestDTO;
import com.store_management.dtos.CustomerResponseDTO;
import com.store_management.services.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponseDTO>>> list(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách thành công", customerService.getCustomers(authorization)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> create(@RequestBody CustomerRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Tạo khách hàng thành công", customerService.createCustomer(request, authorization)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> update(@PathVariable Long id, @RequestBody CustomerRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", customerService.updateCustomer(id, request, authorization)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, @RequestHeader("Authorization") String authorization) {
        customerService.deleteCustomer(id, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Xóa thành công", null));
    }
}
