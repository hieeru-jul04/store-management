package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.OrderRequestDTO;
import com.store_management.dtos.OrderResponseDTO;
import com.store_management.services.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> list(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách thành công", orderService.getOrders(authorization)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> create(@RequestBody OrderRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Tạo đơn hàng thành công", orderService.createOrder(request, authorization)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", orderService.updateOrderStatus(id, body.get("status"), authorization)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(@PathVariable Long id, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết đơn hàng thành công", orderService.getOrderById(id, authorization)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderInfo(@PathVariable Long id, @RequestBody OrderRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật đơn hàng thành công", orderService.updateOrderInfo(id, request, authorization)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id, @RequestHeader("Authorization") String authorization) {
        orderService.deleteOrder(id, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Xóa đơn hàng thành công", null));
    }
}
