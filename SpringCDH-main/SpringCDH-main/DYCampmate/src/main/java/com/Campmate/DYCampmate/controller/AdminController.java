// /src/main/java/com/Campmate/DYCampmate/controller/AdminController.java

package com.Campmate.DYCampmate.controller;

import com.Campmate.DYCampmate.dto.AdminDTO;
// --- [추가] ---
import com.Campmate.DYCampmate.dto.AdminResponseDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.repository.AdminRepo;
// --- [추가] ---
import com.Campmate.DYCampmate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // --- [추가] ---
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // --- [추가] ---
import org.springframework.security.core.context.SecurityContextHolder; // --- [추가] ---
import org.springframework.security.core.userdetails.UsernameNotFoundException; // --- [추가] ---
import org.springframework.web.bind.annotation.*;

import java.util.List; // --- [추가] ---
import java.util.stream.Collectors; // --- [추가] ---

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000") // config/WebConfig 통합 설정
public class AdminController {
    private final AdminService adminService;
    private final AdminRepo adminRepository; // --- [추가] AdminRepo 주입

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AdminDTO dto) {
        try {
            adminService.register(dto);
            return ResponseEntity.ok("회원가입 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- [추가] React 자동 로그인을 위한 /api/admins/me 엔드포인트 ---
    /**
     * 현재 로그인된 관리자(Admin)의 정보를 반환합니다.
     * React 앱이 새로고침될 때 자동 로그인을 위해 사용됩니다.
     */
    @GetMapping("/me")
    public ResponseEntity<AdminResponseDTO> getMyInfo() {
        // 1. Spring Security Context에서 인증 정보(토큰)를 가져옵니다.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. 인증되지 않았거나, 익명 사용자인 경우 401 Unauthorized 응답
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3. 인증된 사용자의 ID (Principal의 name)를 Long 타입으로 변환
        // (AuthController의 login에서 ID를 String으로 토큰에 저장했기 때문)
        Long adminId = Long.parseLong(authentication.getName());

        // 4. ID를 기반으로 AdminEntity 조회 (없으면 예외 발생)
        AdminEntity currentAdmin = adminRepository.findById(adminId)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with ID: " + adminId));

        // 5. Entity를 Response DTO로 변환하여 200 OK 응답
        // (AuthController의 login과 동일한 DTO 사용)
        AdminResponseDTO userDto = new AdminResponseDTO(currentAdmin);
        return ResponseEntity.ok(userDto);
    }
    // -----------------------------------------------------------

    // --- [신규 추가] 전체 관리자 페이지용 API ---
    /**
     * '전체 관리자' 페이지를 위해 모든 관리자 계정 목록을 반환합니다.
     * @return AdminDTO (비밀번호가 null로 처리된) 리스트
     */
    @GetMapping("/all")
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        List<AdminEntity> allAdmins = adminRepository.findAll();

        // Entity List -> AdminDTO List로 변환 (AdminDTO.fromEntity는 비밀번호를 null로 처리)
        List<AdminDTO> dtos = allAdmins.stream()
                .map(AdminDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
    // ---------------------------------------

}