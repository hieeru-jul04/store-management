package com.store_management.repositories;

import com.store_management.entities.ImportBatch;
import com.store_management.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportBatchRepository extends JpaRepository<ImportBatch, Long> {
    List<ImportBatch> findByProductAndRemainingQuantityGreaterThanOrderByCreatedAtAsc(Product product, int quantity);
}
