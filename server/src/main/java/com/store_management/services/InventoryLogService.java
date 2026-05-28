package com.store_management.services;

import com.store_management.dtos.InventoryLogRequestDTO;
import com.store_management.dtos.InventoryLogResponseDTO;
import com.store_management.entities.InventoryLog;
import com.store_management.entities.Product;
import com.store_management.entities.Shop;
import com.store_management.repositories.InventoryLogRepository;
import com.store_management.repositories.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.store_management.entities.ImportBatch;
import com.store_management.repositories.ImportBatchRepository;
import com.store_management.dtos.BatchImportRequestDTO;
import com.store_management.dtos.BatchImportItemDTO;
import jakarta.transaction.Transactional;

@Service
@AllArgsConstructor
public class InventoryLogService {
    private final InventoryLogRepository inventoryLogRepository;
    private final ProductRepository productRepository;
    private final ImportBatchRepository importBatchRepository;
    private final AuthService authService;

    public List<InventoryLogResponseDTO> getLogs(String token) {
        Shop shop = authService.getShopByToken(token);
        return inventoryLogRepository.findByShopOrderByIdDesc(shop).stream()
                .map(InventoryLogResponseDTO::from)
                .collect(Collectors.toList());
    }

    public InventoryLogResponseDTO addLog(InventoryLogRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
        
        if ("out".equalsIgnoreCase(request.getType()) && product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Tồn kho không đủ");
        }
        
        product.setStock(request.getType().equalsIgnoreCase("in") ? 
            product.getStock() + request.getQuantity() : 
            product.getStock() - request.getQuantity());
        productRepository.save(product);

        InventoryLog log = new InventoryLog();
        log.setProduct(product);
        log.setShop(shop);
        log.setType(request.getType());
        log.setQuantity(request.getQuantity());
        log.setNote(request.getNote());

        return InventoryLogResponseDTO.from(inventoryLogRepository.save(log));
    }

    @Transactional
    public void batchImport(BatchImportRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        
        for (BatchImportItemDTO itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
                    
            product.setStock(product.getStock() + itemDto.getQuantity());
            productRepository.save(product);
            
            ImportBatch batch = new ImportBatch();
            batch.setProduct(product);
            batch.setImportPrice(itemDto.getImportPrice());
            batch.setShippingFeePerItem(itemDto.getShippingFeePerItem());
            batch.setInitialQuantity(itemDto.getQuantity());
            batch.setRemainingQuantity(itemDto.getQuantity());
            importBatchRepository.save(batch);
            
            InventoryLog log = new InventoryLog();
            log.setProduct(product);
            log.setShop(shop);
            log.setType("in");
            log.setQuantity(itemDto.getQuantity());
            log.setNote(request.getNote() != null ? request.getNote() : "Nhập lô hàng");
            inventoryLogRepository.save(log);
        }
    }
}
