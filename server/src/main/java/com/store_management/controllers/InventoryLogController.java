package com.store_management.controllers;

import com.store_management.dtos.ApiResponse;
import com.store_management.dtos.InventoryLogRequestDTO;
import com.store_management.dtos.InventoryLogResponseDTO;
import com.store_management.services.InventoryLogService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/inventory-logs")
public class InventoryLogController {
    private final InventoryLogService inventoryLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryLogResponseDTO>>> list(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách thành công", inventoryLogService.getLogs(authorization)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryLogResponseDTO>> create(@RequestBody InventoryLogRequestDTO request, @RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật kho thành công", inventoryLogService.addLog(request, authorization)));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Void>> batchImport(@RequestBody com.store_management.dtos.BatchImportRequestDTO request, @RequestHeader("Authorization") String authorization) {
        inventoryLogService.batchImport(request, authorization);
        return ResponseEntity.ok(ApiResponse.ok("Nhập lô hàng thành công", null));
    }
}
