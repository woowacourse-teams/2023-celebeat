package com.celuveat.restaurant.presentation.dto;

import com.celuveat.restaurant.query.dao.RestaurantSearchResponseDao.RestaurantSearchCond;

public record RestaurantSearchCondRequest(
        Long celebId,
        String category,
        String restaurantName
) {

    public RestaurantSearchCond toCondition() {
        return new RestaurantSearchCond(
                celebId,
                category,
                restaurantName
        );
    }
}
