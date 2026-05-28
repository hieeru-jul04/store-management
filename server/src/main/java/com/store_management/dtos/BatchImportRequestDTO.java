package com.store_management.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BatchImportRequestDTO {
    private List<BatchImportItemDTO> items;
    private String note;
}
