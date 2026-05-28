package com.store_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String address;
    private String taxCode;
    private String currency;
    private int lowStockThreshold;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<Customer> customers;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<Category> categories;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<Product> products;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<InventoryLog> inventoryLogs;
}
