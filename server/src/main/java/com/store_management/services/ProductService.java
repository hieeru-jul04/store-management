package com.store_management.services;

import com.store_management.dtos.ProductRequestDTO;
import com.store_management.dtos.ProductResponseDTO;
import com.store_management.entities.Product;
import com.store_management.entities.Shop;
import com.store_management.entities.Category;
import com.store_management.repositories.ProductRepository;
import com.store_management.repositories.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AuthService authService;

    public List<ProductResponseDTO> getProducts(String token) {
        Shop shop = authService.getShopByToken(token);
        return productRepository.findByShop(shop).stream()
                .map(ProductResponseDTO::from)
                .collect(Collectors.toList());
    }

    public ProductResponseDTO createProduct(ProductRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());
        product.setShop(shop);
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            product.setCategory(category);
        }
        
        return ProductResponseDTO.from(productRepository.save(product));
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getShop().getId().equals(shop.getId())) throw new RuntimeException("Unauthorized");

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            product.setCategory(category);
        }

        return ProductResponseDTO.from(productRepository.save(product));
    }

    public void deleteProduct(Long id, String token) {
        Shop shop = authService.getShopByToken(token);
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getShop().getId().equals(shop.getId())) throw new RuntimeException("Unauthorized");
        productRepository.delete(product);
    }
}
