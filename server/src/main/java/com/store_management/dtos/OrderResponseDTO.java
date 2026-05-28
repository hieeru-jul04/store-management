package com.store_management.dtos;

import com.store_management.entities.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
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
    private double actualProfit;
    private java.time.LocalDate createdAt;

    public static OrderResponseDTO from(Order order) {
        return new OrderResponseDTO(
            order.getId(),
            order.getCode(),
            order.getCustomer() != null ? order.getCustomer().getId() : null,
            order.getCustomer() != null ? order.getCustomer().getName() : null,
            order.getPhone(),
            order.getOrderItems() != null ? order.getOrderItems().stream().map(OrderItemDTO::from).collect(Collectors.toList()) : null,
            order.getTotal(),
            order.getStatus().name(),
            order.getNote(),
            order.getShippingAddress(),
            order.getShippingToCustomerFee(),
            order.getActualProfit(),
            order.getCreatedAt()
        );
    }
}
