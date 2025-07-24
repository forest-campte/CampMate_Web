package com.Campmate.DYCampmate.controller;

import com.Campmate.DYCampmate.dto.AdminResponseDTO;
import com.Campmate.DYCampmate.dto.LoginRequestDTO;
import com.Campmate.DYCampmate.dto.ReservationDTO;
import com.Campmate.DYCampmate.dto.ZoneDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.service.AdminService;
import com.Campmate.DYCampmate.service.AuthService;
import com.Campmate.DYCampmate.service.ReservationService;
import com.Campmate.DYCampmate.service.ZoneService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
//요청 처리 + 응답 반환
//RequestDTO를 받아서 Service 호출 → ResponseDTO로 응답
public class AuthController {

    private final AuthService authService;
    private final ReservationService reservationService;
    private final ZoneService zoneService;

    public AuthController(AuthService authService, ReservationService reservationService, ZoneService zoneService) {
        this.authService = authService;
        this.reservationService = reservationService;
        this.zoneService = zoneService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {

        AdminEntity admin = authService.authenticate(request);

        AdminResponseDTO user = new AdminResponseDTO(admin);
        List<ReservationDTO> reservations = reservationService.getAllReservations();
        List<ZoneDTO> zones = zoneService.getZonesForAdmin(admin);

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("reservations", reservations);
        response.put("zones", zones);

        return ResponseEntity.ok(response);
    }
}