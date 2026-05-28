package com.store_management.repositories;

import com.store_management.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByShop_IdOrderByNameAsc(Long shopId);

    Optional<Customer> findByIdAndShop_Id(Long id, Long shopId);

    List<Customer> findByShopOrderByIdDesc(com.store_management.entities.Shop shop);
}
