package com.store_management.services;

import com.store_management.dtos.CustomerRequestDTO;
import com.store_management.dtos.CustomerResponseDTO;
import com.store_management.entities.Customer;
import com.store_management.entities.Shop;
import com.store_management.repositories.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final AuthService authService;

    public List<CustomerResponseDTO> getCustomers(String token) {
        Shop shop = authService.getShopByToken(token);
        return customerRepository.findByShopOrderByIdDesc(shop).stream()
                .map(CustomerResponseDTO::from)
                .collect(Collectors.toList());
    }

    public CustomerResponseDTO createCustomer(CustomerRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setNote(request.getNote());
        customer.setShop(shop);
        return CustomerResponseDTO.from(customerRepository.save(customer));
    }

    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request, String token) {
        Shop shop = authService.getShopByToken(token);
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        // if (!customer.getShop().getId().equals(shop.getId())) throw new RuntimeException("Unauthorized");

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setNote(request.getNote());
        return CustomerResponseDTO.from(customerRepository.save(customer));
    }

    public void deleteCustomer(Long id, String token) {
        Shop shop = authService.getShopByToken(token);
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        // if (!customer.getShop().getId().equals(shop.getId())) throw new RuntimeException("Unauthorized");
        customerRepository.delete(customer);
    }
}
