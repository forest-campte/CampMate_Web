package com.Campmate.DYCampmate.service;

import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.repository.AdminRepo;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final AdminRepo adminRepo;

    public AdminService(AdminRepo adminRepo) {
        this.adminRepo = adminRepo;
    }

    public AdminEntity findByEmail(String email) {
        return adminRepo.findByEmail(email).orElse(null);
    }
}