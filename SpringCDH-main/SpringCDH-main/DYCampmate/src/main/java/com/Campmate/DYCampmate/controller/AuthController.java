package com.Campmate.DYCampmate.controller;

import com.Campmate.DYCampmate.JwtUtil;
import com.Campmate.DYCampmate.dto.*;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.entity.CustomerEntity;
import com.Campmate.DYCampmate.repository.CustomerRepo;
import com.Campmate.DYCampmate.service.AdminService;
import com.Campmate.DYCampmate.service.AuthService;
import com.Campmate.DYCampmate.service.CampingZoneService;
import com.Campmate.DYCampmate.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class AuthController {

    private final AdminService adminService;
    private final AuthService authService;
    private final ReservationService reservationService;
    private final CustomerRepo customerRepository;
    private final JwtUtil jwtUtil;
    private final CampingZoneService campingZoneService; // 오타 수정
    private final PasswordEncoder passwordEncoder; // Bean으로 주입받음

    @PostMapping("/admins/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {

        AdminEntity admin = authService.authenticate(request); // 인증 성공 시 AdminEntity 객체 반환

        String token = jwtUtil.createToken(String.valueOf(admin.getId()), admin.getEmail());

        AdminResponseDTO user = new AdminResponseDTO(admin);

        // --- 📝 [핵심 수정] ---
        // 서비스 메서드가 AdminEntity를 받도록 수정되었으므로, admin 객체 자체를 전달합니다.
        List<ReservationDTO> reservations = reservationService.getReservationsForAdmin(admin);
        List<CampingZoneDto> zones = campingZoneService.getZonesForAdmin(admin);
        // -----------------------

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("reservations", reservations);
        response.put("zones", zones);
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/customer/social")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginDTO dto) {
        String socialId = dto.getId();
        String provider = dto.getProvider();

        CustomerEntity user = customerRepository
                .findByCustomerIdAndProvider(socialId, provider)
                .orElse(null);

        // 소셜 회원가입 시에는 주입받은 passwordEncoder 사용
        String dummyPassword = passwordEncoder.encode(UUID.randomUUID().toString());

        if (user == null) {
            user = CustomerEntity.builder()
                    .customerId(socialId)
                    .provider(provider)
                    .email(dto.getEmail())
                    .password(dummyPassword)
                    .customersStyle("-")
                    .customersBackground("-")
                    .customersType("-")
                    .createdDate(LocalDateTime.now())
                    .build();

            customerRepository.save(user);
        }

        String jwt = jwtUtil.createToken(user.getCustomerId(), user.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "로그인 성공",
                "token", jwt
        ));
    }
}