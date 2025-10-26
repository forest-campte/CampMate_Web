package com.Campmate.DYCampmate.controller;

import com.Campmate.DYCampmate.dto.ReservationDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.entity.ReservationEntity;
import com.Campmate.DYCampmate.repository.AdminRepo; // AdminRepo import 추가
import com.Campmate.DYCampmate.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // HttpStatus import 추가
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Authentication import 추가
import org.springframework.security.core.context.SecurityContextHolder; // SecurityContextHolder import 추가
import org.springframework.security.core.userdetails.UsernameNotFoundException; // 예외 import 추가
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations") // 📝 일관성을 위해 /api 로 시작하도록 수정
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final AdminRepo adminRepository; // 📝 AdminEntity 조회를 위해 AdminRepo 주입

    // 로그인한 Admin 아이디를 가져와서 조회함.
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getMyReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 📝 HttpStatus import 확인
        }
        Long adminId = Long.parseLong(authentication.getName());

        // --- 📝 [핵심 수정 1] ---
        // adminId로 AdminEntity 조회
        AdminEntity currentAdmin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));
        // 서비스 메서드에 AdminEntity 전달
        List<ReservationDTO> reservations = reservationService.getReservationsForAdmin(currentAdmin);
        // -----------------------

        return ResponseEntity.ok(reservations);
    }

    /**
     * 전체 예약 목록 조회
     */
    @GetMapping("/all")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        List<ReservationDTO> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    /**
     * 특정 관리자(Admin)의 모든 예약 조회
     * @param adminId 관리자 ID
     */
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByAdmin(@PathVariable Long adminId) {
        // --- 📝 [핵심 수정 2] ---
        // adminId로 AdminEntity 조회
        AdminEntity admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));
        // 서비스 메서드에 AdminEntity 전달
        List<ReservationDTO> reservations = reservationService.getReservationsForAdmin(admin);
        // -----------------------
        return ResponseEntity.ok(reservations);
    }

    /**
     * 특정 관리자(Admin)의 특정 상태(Status)의 예약 조회
     */
    @GetMapping("/admin/{adminId}/status")
    public ResponseEntity<List<ReservationDTO>> getReservationsByAdminAndStatus(
            @PathVariable Long adminId,
            @RequestParam("status") List<ReservationEntity.ReservationStatus> status) { // List로 받는 경우

        // 📝 adminId로 AdminEntity 조회
        AdminEntity admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));

        // 📝 서비스 메서드 확인 및 호출
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        // --- 📝 [핵심 수정 3] ---
        // 서비스 메서드 이름과 파라미터 확인 (단일 상태 조회)
        List<ReservationDTO> reservations = reservationService.getReservationsByStatus(admin, status.get(0));
        // -----------------------

        return ResponseEntity.ok(reservations);
    }

    /**
     * 특정 관리자(Admin)의 여러 상태(Status 목록)의 예약 조회
     */
    @GetMapping("/admin/{adminId}/statuses")
    public ResponseEntity<List<ReservationDTO>> getReservationsByAdminAndStatuses(
            @PathVariable Long adminId,
            @RequestParam List<ReservationEntity.ReservationStatus> statuses) {

        // 📝 adminId로 AdminEntity 조회
        AdminEntity admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));
        // 📝 서비스 메서드에 AdminEntity 전달 (변경 없음)
        List<ReservationDTO> reservations =
                reservationService.getReservationsByStatuses(admin, statuses);

        return ResponseEntity.ok(reservations);
    }
}