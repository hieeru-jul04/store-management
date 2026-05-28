package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryLogRequestDTO {
    private Long productId;
    private String type;
    private int quantity;
    private String note;
}
