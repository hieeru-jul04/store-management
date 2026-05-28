package com.store_management.dtos;

import com.store_management.entities.Shop;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShopResponseDTO {
    private Long id;
    private String shopName;
    private String phone;
    private String address;
    private String taxCode;
    private String currency;
    private int lowStockThreshold;

    public static ShopResponseDTO from(Shop shop) {
        return new ShopResponseDTO(
            shop.getId(),
            shop.getName(),
            shop.getPhone(),
            shop.getAddress(),
            shop.getTaxCode(),
            shop.getCurrency(),
            shop.getLowStockThreshold()
        );
    }
}
