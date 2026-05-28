package com.store_management.repositories;

import com.store_management.entities.InventoryLog;
import com.store_management.entities.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByShopOrderByIdDesc(Shop shop);
}
