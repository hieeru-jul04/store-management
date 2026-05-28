package com.store_management.repositories;

import com.store_management.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByCategory_Id(Long categoryId);
    java.util.List<Product> findByShop(com.store_management.entities.Shop shop);
}
