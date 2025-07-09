package com.Campmate.DYCampmate.controller;

import com.Campmate.DYCampmate.dto.CustomerLoginRequestDTO;
import com.Campmate.DYCampmate.dto.CustomerLoginResponseDTO;
import com.Campmate.DYCampmate.dto.CustomerRequestDTO;
import com.Campmate.DYCampmate.dto.CustomerResponseDTO;
import com.Campmate.DYCampmate.service.CustomerService;
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
    public ResponseEntity<Integer> registerCustomer(@RequestBody CustomerRequestDTO dto) {

        Integer id = customerService.registerCustomer(dto);
        return ResponseEntity.ok(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustomerLoginRequestDTO dto) {
        try {
            CustomerLoginResponseDTO response = customerService.loginByEmail(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomer(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }
}
