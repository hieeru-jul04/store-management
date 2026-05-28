package com.store_management.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustomerRequestDTO {
    @NotBlank(message = "Tên khách hàng không được để trống")
    private String name;

    private String phone;
    private String email;
    private String address;
    private String note;
}
