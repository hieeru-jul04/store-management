package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {
    private String code;
    private Long customerId;
    private String customerName;
    private String phone;
    private List<OrderItemDTO> items;
    private double total;
    private String status;
    private String note;
    private String shippingAddress;
    private double shippingToCustomerFee;
    private String createdAt;
}
