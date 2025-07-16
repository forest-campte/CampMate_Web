package com.Campmate.DYCampmate.controller;

import com.Campmate.DYCampmate.dto.CustomerLoginRequestDTO;
import com.Campmate.DYCampmate.dto.CustomerLoginResponseDTO;
import com.Campmate.DYCampmate.dto.CustomerRequestDTO;
import com.Campmate.DYCampmate.dto.CustomerResponseDTO;
import com.Campmate.DYCampmate.entity.CustomerEntity;
import com.Campmate.DYCampmate.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
//요청 처리 + 응답 반환
//RequestDTO를 받아서 Service 호출 → ResponseDTO로 응답
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<Long> registerCustomer(@RequestBody CustomerRequestDTO dto) {
        Long id = customerService.registerCustomer(dto);
        return ResponseEntity.ok(id);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody CustomerLoginRequestDTO dto) {
        try {
            CustomerLoginResponseDTO response = customerService.login(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(HttpServletRequest request) {
        CustomerEntity customer = (CustomerEntity) request.getAttribute("customerId"); // customers_Id??

        if (customer == null) {
            return ResponseEntity.status(401).body("토큰이 유효하지 않거나 만료되었습니다.");
        }

        CustomerResponseDTO dto = CustomerResponseDTO.builder()
                .id(customer.getId())
                .customerId(customer.getCustomerId())
                .email(customer.getEmail())
                .nickname(customer.getNickname())
                .customersStyle(customer.getCustomersStyle())
                .customersBackground(customer.getCustomersBackground())
                .customersType(customer.getCustomersType())
                .build();

        return ResponseEntity.ok(dto);
    }


}
