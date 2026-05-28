package com.store_management.repositories;

import com.store_management.entities.Order;
import com.store_management.entities.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerShopOrderByIdDesc(Shop shop);
}
