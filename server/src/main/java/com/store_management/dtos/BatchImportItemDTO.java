package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BatchImportItemDTO {
    private Long productId;
    private int quantity;
    private double importPrice;
    private double shippingFeePerItem;
}
