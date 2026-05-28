package com.store_management.dtos;

import com.store_management.entities.InventoryLog;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class InventoryLogResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String type;
    private int quantity;
    private String note;
    private LocalDateTime createdAt;

    public static InventoryLogResponseDTO from(InventoryLog log) {
        return new InventoryLogResponseDTO(
            log.getId(),
            log.getProduct().getId(),
            log.getProduct().getName(),
            log.getType(),
            log.getQuantity(),
            log.getNote(),
            log.getCreatedAt()
        );
    }
}
