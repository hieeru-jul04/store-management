package com.store_management.dtos;

import com.store_management.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String sku;
    private int stock;
    private String status;
    private String description;
    private Long categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponseDTO from(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getStock(),
                product.getStatus(),
                product.getDescription(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
