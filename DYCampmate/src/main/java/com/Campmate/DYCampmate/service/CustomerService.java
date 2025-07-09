package com.Campmate.DYCampmate.service;

import com.Campmate.DYCampmate.dto.CustomerLoginResponseDTO;
import com.Campmate.DYCampmate.entity.CustomerEntity;
import com.Campmate.DYCampmate.dto.CustomerRequestDTO;
import com.Campmate.DYCampmate.dto.CustomerResponseDTO;
import com.Campmate.DYCampmate.repository.CustomerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
//실제 비즈니스 로직 처리
//트랜잭션, 예외 처리 포함
//Entity <-> DTO 변환도 여기서 주로 처리
public class CustomerService {
    private final CustomerRepo customerRepository;

    //회원가입
    public Integer registerCustomer(CustomerRequestDTO dto) {
        if (customerRepository.existsByCustomerId(dto.getCustomerId())) {
            throw new IllegalArgumentException("이미 존재하는 고객 ID입니다.");
        }

        CustomerEntity customer = CustomerEntity.builder()
                .customerId(dto.getCustomerId())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .nickname(dto.getNickname())
                //Table 수정 필요
//                .campingType(dto.getCampingType())
                .createdDate(LocalDateTime.now())
                .build();

        return customerRepository.save(customer).getId();
    }

    public CustomerResponseDTO getCustomerById(Integer id) {
        CustomerEntity customer = customerRepository.findByCustomerId(String.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("해당 고객을 찾을 수 없습니다."));

        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .customerId(customer.getCustomerId())
                .email(customer.getEmail())
                .nickname(customer.getNickname())
                //Table 수정 필요
//                .campingType(customer.getCampingType())
                .build();
    }

    public CustomerLoginResponseDTO loginByEmail(CustomerLoginResponseDTO dto) {
        CustomerEntity customer = customerRepository.findByEmail(dto.getUserName())
                .orElseThrow(() -> new IllegalArgumentException("이름 없음"));

//        if (!passwordEncoder.matches(dto.getPassword(), customer.getPassword())) {
//            throw new IllegalArgumentException("비밀번호 불일치");
//        }
        if (dto.getPassword(), customer.getPassword()) {
            throw new IllegalArgumentException("비밀번호 불일치");
        }

        String token = jwtUtil.generateToken(customer.getCustomerId());

        return LoginResponseDTO.builder()
                .userName(customer.getNickname() != null ? customer.getNickname() : customer.getCustomerId())
                .accessToken(token)
                .build();
    }

}
