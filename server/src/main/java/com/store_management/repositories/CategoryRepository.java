package com.store_management.repositories;

import com.store_management.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByShop_IdOrderByNameAsc(Long shopId);

    Optional<Category> findByIdAndShop_Id(Long id, Long shopId);

    boolean existsByShop_IdAndNameIgnoreCase(Long shopId, String name);

    boolean existsByShop_IdAndNameIgnoreCaseAndIdNot(Long shopId, String name, Long id);
}
