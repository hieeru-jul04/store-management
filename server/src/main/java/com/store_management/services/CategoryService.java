package com.store_management.services;

import com.store_management.dtos.CategoryRequestDTO;
import com.store_management.dtos.CategoryResponseDTO;
import com.store_management.entities.Category;
import com.store_management.entities.Shop;
import com.store_management.entities.User;
import com.store_management.repositories.CategoryRepository;
import com.store_management.repositories.ProductRepository;
import com.store_management.repositories.UserRepository;
import com.store_management.util.TokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getCategories(String authorization) {
        Shop shop = resolveShop(authorization);
        return categoryRepository.findByShop_IdOrderByNameAsc(shop.getId()).stream()
                .map(CategoryResponseDTO::from)
                .toList();
    }

    @Transactional
    public CategoryResponseDTO createCategory(CategoryRequestDTO request, String authorization) {
        Shop shop = resolveShop(authorization);
        String name = request.getName().trim();

        if (categoryRepository.existsByShop_IdAndNameIgnoreCase(shop.getId(), name)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        Category category = new Category();
        category.setName(name);
        category.setShop(shop);

        return CategoryResponseDTO.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO request, String authorization) {
        Shop shop = resolveShop(authorization);
        String name = request.getName().trim();

        Category category = categoryRepository.findByIdAndShop_Id(id, shop.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));

        if (categoryRepository.existsByShop_IdAndNameIgnoreCaseAndIdNot(shop.getId(), name, id)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        category.setName(name);
        return CategoryResponseDTO.from(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id, String authorization) {
        Shop shop = resolveShop(authorization);

        Category category = categoryRepository.findByIdAndShop_Id(id, shop.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));

        if (productRepository.existsByCategory_Id(category.getId())) {
            throw new IllegalArgumentException("Danh mục đang có sản phẩm, không thể xóa");
        }

        categoryRepository.delete(category);
    }

    private Shop resolveShop(String authorization) {
        Long userId = TokenUtil.getUserIdFromAuthorization(authorization);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));

        Shop shop = user.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("Cửa hàng không tồn tại");
        }
        return shop;
    }
}
