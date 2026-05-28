package com.store_management.dtos;

import com.store_management.entities.Customer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class CustomerResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String note;
    private java.time.LocalDateTime createdAt;

    public static CustomerResponseDTO from(Customer customer) {
        return new CustomerResponseDTO(
                customer.getId(),
                customer.getName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getNote(),
                customer.getCreatedAt()
        );
    }
}
