package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShopRequestDTO {
    private String shopName;
    private String phone;
    private String address;
    private String taxCode;
    private String currency;
    private int lowStockThreshold;
}
