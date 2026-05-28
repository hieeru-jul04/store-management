package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestDTO {
    private String name;
    private String sku;
    private String status;
    private String description;
    private Long categoryId;
}
