package com.Campmate.DYCampmate.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Data Transfer Object
// Controller <-> Service 간 전달용 객체
public class CustomerRequestDTO {
    private String customerId;
    private String password;
    private String email;
    private String nickname;
    // DB 테이블 수정 필요
//    private String campingType;

}
