package com.celuveat.administrativedistrict.domain;

import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Geometry;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class AdministrativeDistrict {

    @Id
    private Long id;

    @Column(nullable = false)
    private Geometry polygon;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String englishName;

    @Column(nullable = false)
    private String koreanName;
}
