package com.store_management.services;

import com.store_management.dtos.OrderRequestDTO;
import com.store_management.dtos.OrderResponseDTO;
import com.store_management.dtos.OrderItemDTO;
import com.store_management.entities.*;
import com.store_management.repositories.OrderRepository;
import com.store_management.repositories.CustomerRepository;
import com.store_management.repositories.ProductRepository;
import com.store_management.repositories.ImportBatchRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ImportBatchRepository importBatchRepository;
    private final AuthService authService;

    public List<OrderResponseDTO> getOrders(String token) {
        Shop shop = authService.getShopByToken(token);
        return orderRepository.findByCustomerShopOrderByIdDesc(shop).stream()
                .map(OrderResponseDTO::from)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO createOrder(OrderRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Order order = new Order();
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            order.setCode("ORD-" + System.currentTimeMillis());
        } else {
            order.setCode(request.getCode());
        }
        order.setPhone(request.getPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        
        try {
            order.setStatus(OrderStatus.valueOf(request.getStatus().toUpperCase()));
        } catch(Exception e) {
            order.setStatus(OrderStatus.PENDING);
        }

        if (request.getCreatedAt() != null && !request.getCreatedAt().trim().isEmpty()) {
            try {
                if (request.getCreatedAt().contains("T")) {
                    order.setCreatedAt(java.time.ZonedDateTime.parse(request.getCreatedAt()).toLocalDate());
                } else {
                    order.setCreatedAt(java.time.LocalDate.parse(request.getCreatedAt()));
                }
            } catch (Exception e) {
                order.setCreatedAt(java.time.LocalDate.now());
            }
        } else {
            order.setCreatedAt(java.time.LocalDate.now());
        }

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId()).orElse(null);
            if (customer != null && request.getShippingAddress() != null && !request.getShippingAddress().trim().isEmpty()) {
                customer.setAddress(request.getShippingAddress().trim());
                customerRepository.save(customer);
            }
            order.setCustomer(customer);
        } else if (request.getCustomerName() != null) {
            Customer tempCustomer = new Customer();
            tempCustomer.setName(request.getCustomerName());
            tempCustomer.setPhone(request.getPhone());
            tempCustomer.setAddress(request.getShippingAddress() != null ? request.getShippingAddress().trim() : null);
            tempCustomer.setShop(shop);
            order.setCustomer(customerRepository.save(tempCustomer));
        }
        
        List<OrderItem> items = new ArrayList<>();
        double total = 0.0;
        double totalCost = 0.0;
        if(request.getItems() != null) {
            for(OrderItemDTO dto : request.getItems()) {
                Product product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
                
                if (product.getStock() < dto.getQuantity()) {
                    throw new RuntimeException("Không đủ tồn kho cho sản phẩm: " + product.getName());
                }

                // Deduct stock
                product.setStock(product.getStock() - dto.getQuantity());
                productRepository.save(product);

                // FIFO deduction
                List<ImportBatch> batches = importBatchRepository.findByProductAndRemainingQuantityGreaterThanOrderByCreatedAtAsc(product, 0);
                int remainingToDeduct = dto.getQuantity();
                for (ImportBatch batch : batches) {
                    if (remainingToDeduct <= 0) break;
                    int deductAmount = Math.min(batch.getRemainingQuantity(), remainingToDeduct);
                    batch.setRemainingQuantity(batch.getRemainingQuantity() - deductAmount);
                    importBatchRepository.save(batch);
                    
                    double costPerUnit = batch.getImportPrice() + batch.getShippingFeePerItem();
                    totalCost += costPerUnit * deductAmount;
                    remainingToDeduct -= deductAmount;
                }

                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity(dto.getQuantity());
                item.setPrice(dto.getPrice());
                items.add(item);
                
                total += dto.getPrice() * dto.getQuantity();
            }
        }
        order.setTotal(total);
        order.setShippingToCustomerFee(request.getShippingToCustomerFee());
        order.setActualProfit(total - totalCost - request.getShippingToCustomerFee());
        order.setOrderItems(items);
        return OrderResponseDTO.from(orderRepository.save(order));
    }

    public OrderResponseDTO updateOrderStatus(Long id, String status, String token) {
        Shop shop = authService.getShopByToken(token);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        // if (!order.getCustomer().getShop().getId().equals(shop.getId())) throw new RuntimeException("Unauthorized");
        
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        return OrderResponseDTO.from(orderRepository.save(order));
    }

    public OrderResponseDTO getOrderById(Long id, String token) {
        Shop shop = authService.getShopByToken(token);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderResponseDTO.from(order);
    }

    public OrderResponseDTO updateOrderInfo(Long id, OrderRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        order.setPhone(request.getPhone());
        return OrderResponseDTO.from(orderRepository.save(order));
    }

    public void deleteOrder(Long id, String token) {
        Shop shop = authService.getShopByToken(token);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        orderRepository.delete(order);
    }
}
