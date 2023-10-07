package com.celuveat.restaurant.presentation.dto;

import com.celuveat.restaurant.query.dao.RestaurantByRegionCodeResponseDao.RegionCodeCond;
import java.util.List;

public record RegionCodeCondRequest(
        List<String> codes
) {

    public RegionCodeCond toCondition() {
        return new RegionCodeCond(codes);
    }
}
