package com.Campmate.DYCampmate.service;

import com.Campmate.DYCampmate.dto.AdminRequestDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.repository.AdminRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepo adminRepository;
    private final PasswordEncoder passwordEncoder;
//    public AdminService(AdminRepo adminRepo) { this.adminRepo = adminRepo;}

    public AdminEntity findByEmail(String email) {
        return adminRepository.findByEmail(email).orElse(null);
    }
    public void register(AdminRequestDTO dto) {
        if (adminRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }

        AdminEntity admin = AdminEntity.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .description(dto.getDescription())
                .campingStyle(dto.getCampingStyle())
                .campingBackground(dto.getCampingBackground())
                .campingType(dto.getCampingType())
                .build();

        adminRepository.save(admin); // 실제 DB 저장
    }
}