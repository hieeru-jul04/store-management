package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.store_management.entities.OrderItem;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long productId;
    private String productName;
    private int quantity;
    private double price;

    public static OrderItemDTO from(OrderItem item) {
        return new OrderItemDTO(
            item.getProduct().getId(),
            item.getProduct().getName(),
            item.getQuantity(),
            item.getPrice()
        );
    }
}
