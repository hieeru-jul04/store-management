package com.store_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class ImportBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private double importPrice;
    private double shippingFeePerItem;
    private int initialQuantity;
    private int remainingQuantity;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
