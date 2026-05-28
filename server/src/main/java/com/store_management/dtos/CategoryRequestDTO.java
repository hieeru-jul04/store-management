package com.store_management.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CategoryRequestDTO {

    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
}
