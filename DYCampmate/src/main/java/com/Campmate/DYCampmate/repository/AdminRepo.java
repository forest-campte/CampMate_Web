package com.Campmate.DYCampmate.repository;

import com.Campmate.DYCampmate.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<AdminEntity, Long> {

    Optional<AdminEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
