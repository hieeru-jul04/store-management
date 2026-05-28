package com.store_management.services;

import com.store_management.dtos.ShopRequestDTO;
import com.store_management.dtos.ShopResponseDTO;
import com.store_management.entities.Shop;
import com.store_management.repositories.ShopRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final AuthService authService;

    public ShopResponseDTO getShop(String token) {
        Shop shop = authService.getShopByToken(token);
        return ShopResponseDTO.from(shop);
    }

    public ShopResponseDTO updateShop(ShopRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        shop.setName(request.getShopName());
        shop.setPhone(request.getPhone());
        shop.setAddress(request.getAddress());
        shop.setTaxCode(request.getTaxCode());
        shop.setCurrency(request.getCurrency());
        shop.setLowStockThreshold(request.getLowStockThreshold());
        
        return ShopResponseDTO.from(shopRepository.save(shop));
    }
}
