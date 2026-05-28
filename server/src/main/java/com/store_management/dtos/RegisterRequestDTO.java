package com.store_management.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequestDTO {
    @NotBlank(message = "name không được để trống")
    private String fullName;

    @NotBlank(message = "username không được để trống")
    @Size(min = 3, max = 20, message = "Username phải từ 3-20 ký tự")
    private String username;

    @NotBlank(message = "password không được để trống")
    @Size(min = 6, message = "password phải >= 6 ký tự")
    private String password;

    @NotBlank(message = "shop name không được để trống")
    private String shopName;
}
