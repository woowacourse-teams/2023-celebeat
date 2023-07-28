package com.celuveat.acceptance.restaurant;

import static com.celuveat.acceptance.common.AcceptanceSteps.given;
import static java.util.Comparator.comparing;
import static org.assertj.core.api.Assertions.assertThat;

import com.celuveat.common.PageResponse;
import com.celuveat.common.util.StringUtil;
import com.celuveat.restaurant.application.dto.CelebQueryResponse;
import com.celuveat.restaurant.application.dto.RestaurantQueryResponse;
import com.celuveat.restaurant.domain.RestaurantQueryRepository.LocationSearchCond;
import com.celuveat.restaurant.domain.RestaurantQueryRepository.RestaurantSearchCond;
import io.restassured.common.mapper.TypeRef;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RestaurantAcceptanceSteps {

    public static ExtractableResponse<Response> 음식점_검색_요청(
            RestaurantSearchCond 음식점_검색_조건,
            LocationSearchCond 위치_검색_조건
    ) {
        Map<String, Object> param = new HashMap<>();
        param.put("celebId", 음식점_검색_조건.celebId());
        param.put("category", 음식점_검색_조건.category());
        param.put("restaurantName", 음식점_검색_조건.restaurantName());
        param.put("lowLatitude", 위치_검색_조건.lowLatitude());
        param.put("highLatitude", 위치_검색_조건.highLatitude());
        param.put("lowLongitude", 위치_검색_조건.lowLongitude());
        param.put("highLongitude", 위치_검색_조건.highLongitude());
        return given()
                .queryParams(param)
                .when().get("/api/restaurants")
                .then().log().all()
                .extract();
    }

    public static RestaurantSearchCond 음식점_검색_조건(
            Object 셀럽_ID,
            Object 카테고리,
            Object 음식점_이름
    ) {
        return new RestaurantSearchCond(
                (Long) 셀럽_ID,
                (String) 카테고리,
                (String) 음식점_이름
        );
    }

    public static LocationSearchCond 검색_영역(Object 포함_영역) {
        if (포함_영역 == null) {
            return new LocationSearchCond(null, null, null, null);
        }
        LocationSearchCond 검색_영역 = (LocationSearchCond) 포함_영역;
        return new LocationSearchCond(
                검색_영역.lowLatitude(),
                검색_영역.highLatitude(),
                검색_영역.lowLongitude(),
                검색_영역.highLongitude()
        );
    }

    public static void 조회_결과를_검증한다(List<RestaurantQueryResponse> 예상_응답, ExtractableResponse<Response> 응답) {
        PageResponse<RestaurantQueryResponse> restaurantQueryResponse = 응답.as(new TypeRef<>() {
        });
        assertThat(restaurantQueryResponse.content())
                .isSortedAccordingTo(comparing(RestaurantQueryResponse::distance))
                .usingRecursiveComparison()
                .ignoringFields("distance")
                .ignoringCollectionOrder()
                .isEqualTo(예상_응답);
    }

    public static List<RestaurantQueryResponse> 예상_응답(
            List<RestaurantQueryResponse> 전체_음식점,
            Object 셀럽_ID,
            Object 카테고리,
            Object 음식점_이름,
            Object 검색_영역
    ) {
        List<RestaurantQueryResponse> 예상_응답 = new ArrayList<>();
        Long celebId = (Long) 셀럽_ID;
        String category = (String) 카테고리;
        String restaurantName = (String) 음식점_이름;
        LocationSearchCond locationSearchCond = (LocationSearchCond) 검색_영역;
        for (RestaurantQueryResponse restaurantQueryResponse : 전체_음식점) {
            List<Long> list = restaurantQueryResponse.celebs()
                    .stream()
                    .map(CelebQueryResponse::id)
                    .toList();

            if (음식점_이름_조건(restaurantName, restaurantQueryResponse)
                    && 카테고리_조건(category, restaurantQueryResponse)
                    && 셀럽_조건(celebId, list)
                    && 영역_조건(locationSearchCond, restaurantQueryResponse)) {
                예상_응답.add(restaurantQueryResponse);
            }
        }
        return 예상_응답;
    }

    private static boolean 음식점_이름_조건(String restaurantName, RestaurantQueryResponse restaurantQueryResponse) {
        if (restaurantName == null) {
            return true;
        }
        return restaurantQueryResponse.name().contains(StringUtil.removeAllBlank(restaurantName));
    }

    private static boolean 카테고리_조건(String category, RestaurantQueryResponse restaurantQueryResponse) {
        if (category == null) {
            return true;
        }
        return restaurantQueryResponse.category().equals(category);
    }

    private static boolean 셀럽_조건(Long celebId, List<Long> list) {
        if (celebId == null) {
            return true;
        }
        return list.contains(celebId);
    }

    private static boolean 영역_조건(
            LocationSearchCond locationSearchCond,
            RestaurantQueryResponse restaurantQueryResponse
    ) {
        if (locationSearchCond == null) {
            return true;
        }

        return locationSearchCond.lowLatitude() <= restaurantQueryResponse.latitude()
                && restaurantQueryResponse.latitude() <= locationSearchCond.highLatitude()
                && locationSearchCond.lowLongitude() <= restaurantQueryResponse.longitude()
                && restaurantQueryResponse.longitude() <= locationSearchCond.highLongitude();
    }
}
