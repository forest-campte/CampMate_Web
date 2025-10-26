package com.Campmate.DYCampmate.service;

import com.Campmate.DYCampmate.dto.ReservationDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.entity.ReservationEntity;
import com.Campmate.DYCampmate.mapper.ReservationMapper;
import com.Campmate.DYCampmate.repository.ReservationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Transactional import 추가

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true) // 클래스 레벨에 readOnly 트랜잭션 적용
public class ReservationService {

    private final ReservationRepo reservationRepo;
    private final ReservationMapper reservationMapper;

    /**
     * 특정 관리자(Admin)의 모든 예약을 조회하는 메서드
     * @param admin 현재 로그인된 관리자 엔티티
     */
    // --- 📝 [핵심 수정] ---
    // 메서드 파라미터 타입을 Long adminId 에서 AdminEntity admin 으로 변경합니다.
    public List<ReservationDTO> getReservationsForAdmin(AdminEntity admin) {
        // Repository 메서드 호출 시에도 AdminEntity 객체를 전달합니다.
        List<ReservationEntity> reservations = reservationRepo.findByCampingZone_Admin(admin);
        return reservationMapper.toDtoList(reservations);
    }
    // -----------------------

    // 전체 예약 조회 메서드는 그대로 유지
    public List<ReservationDTO> getAllReservations(){
        return reservationMapper.toDtoList(reservationRepo.findAll());
    }

    // 상태별 조회 메서드들도 파라미터 타입을 AdminEntity로 받도록 유지 (변경 없음)
    public List<ReservationDTO> getReservationsByStatus(AdminEntity admin, ReservationEntity.ReservationStatus status) {
        return reservationMapper
                .toDtoList(reservationRepo.findByCampingZone_AdminAndStatus(admin, status));
    }

    // 여러 상태의 예약 조회 (R, C, E 등) (변경 없음)
    public List<ReservationDTO> getReservationsByStatuses(AdminEntity admin, List<ReservationEntity.ReservationStatus> statuses) {
        return reservationMapper
                .toDtoList(reservationRepo.findByCampingZone_AdminAndStatusIn(admin, statuses));
    }

    // 이 메서드는 ReservationController에서 사용하지 않는 것으로 보이므로,
    // 필요 없다면 삭제하거나, 사용한다면 파라미터 타입을 맞춰주어야 합니다.
    // 일단은 그대로 둡니다.
    public List<ReservationDTO> getReservationsByAdminAndStatus(Long adminId, List<ReservationEntity.ReservationStatus> status) {
        // Repository 메서드가 Long을 받는지 확인 필요
        // 현재 ReservationRepo에는 findByAdminIdAndStatusInWithCampingZone 메서드가 없으므로 컴파일 에러 발생 가능성 있음
        // return reservationMapper
        //        .toDtoList(reservationRepo.findByAdminIdAndStatusInWithCampingZone(adminId, status));
        // 임시 반환 (컴파일 에러 방지)
        throw new UnsupportedOperationException("findByAdminIdAndStatusInWithCampingZone 메서드가 ReservationRepo에 정의되지 않았습니다.");
    }

}