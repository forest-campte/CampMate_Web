package com.Campmate.DYCampmate.entity;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// DB 테이블 구조와 매핑되는 클래스
@Entity
@Table(name = "customers")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "customers_id", nullable = false, length = 100)
    private String customerId;

    @Column(name = "customers_password", nullable = false, length = 100)
    private String password;

    @Column(name = "customers_email", nullable = false, length = 100)
    private String email;

    @Column(name = "customers_nickname", length = 100)
    private String nickname;

// Table 수정 필요
//    @Column(name = "camping_type", nullable = false, length = 100)
//    private String campingType;

    @Column(name = "create_dt")
    private LocalDateTime createdDate;
}
