package com.celuveat.restaurant.command.domain;

import static lombok.AccessLevel.PROTECTED;

import com.celuveat.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.geolatte.geom.Point;

@Entity
@NoArgsConstructor(access = PROTECTED)
public class Restaurant extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String roadAddress;

    private String phoneNumber;

    @Column(nullable = false)
    private String naverMapUrl;

    @Embedded
    private RestaurantPoint restaurantPoint;

    private int viewCount;

    private int likeCount;

    private int reviewCount;

    private double totalRating;

    @Builder
    public Restaurant(
            String name,
            String category,
            String roadAddress,
            String phoneNumber,
            String naverMapUrl,
            double latitude,
            double longitude
    ) {
        this.name = name;
        this.category = category;
        this.roadAddress = roadAddress;
        this.phoneNumber = phoneNumber;
        this.naverMapUrl = naverMapUrl;
        this.restaurantPoint = new RestaurantPoint(latitude, longitude);
    }

    public void clickLike() {
        this.likeCount += 1;
    }

    public void cancelLike() {
        this.likeCount -= 1;
    }

    public void increaseViewCount() {
        this.viewCount += 1;
    }

    public void addReviewRating(double rating) {
        this.totalRating += rating;
        this.reviewCount += 1;
    }

    public void deleteReviewRating(double rating) {
        this.totalRating -= rating;
        this.reviewCount -= 1;
    }

    public String name() {
        return name;
    }

    public String category() {
        return category;
    }

    public String roadAddress() {
        return roadAddress;
    }

    public String phoneNumber() {
        return phoneNumber;
    }

    public String naverMapUrl() {
        return naverMapUrl;
    }

    public RestaurantPoint restaurantPoint() {
        return restaurantPoint;
    }

    public double latitude() {
        return restaurantPoint.latitude();
    }

    public double longitude() {
        return restaurantPoint.longitude();
    }

    public Point<?> point() {
        return restaurantPoint.point();
    }

    public Integer viewCount() {
        return viewCount;
    }

    public int likeCount() {
        return likeCount;
    }

    public int reviewCount() {
        return reviewCount;
    }

    public double totalRating() {
        return totalRating;
    }
}
