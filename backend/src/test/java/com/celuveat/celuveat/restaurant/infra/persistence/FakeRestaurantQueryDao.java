package com.celuveat.celuveat.restaurant.infra.persistence;

import static org.mockito.Mockito.mock;

import com.celuveat.celuveat.common.page.PageCond;
import com.celuveat.celuveat.common.page.PageResponse;
import com.celuveat.celuveat.restaurant.application.dto.RestaurantSearchResponse;
import com.celuveat.celuveat.restaurant.domain.Restaurant;
import com.celuveat.celuveat.restaurant.fixture.RestaurantFixture;
import com.celuveat.celuveat.video.domain.Video;
import com.celuveat.celuveat.video.infra.persistence.FakeVideoDao;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;

public class FakeRestaurantQueryDao extends RestaurantQueryDao {

    private final FakeVideoDao videoDao;
    private final Map<Long, Restaurant> store = new HashMap<>();
    private long id = 1L;

    public FakeRestaurantQueryDao(FakeVideoDao videoDao) {
        super(mock(JdbcTemplate.class));
        this.videoDao = videoDao;
    }

    public Long save(Restaurant restaurant) {
        store.put(id, restaurant);
        return id++;
    }

    @Override
    public PageResponse<RestaurantSearchResponse> findAllByCelebId(Long celebId, PageCond cond) {
        List<Video> videos = videoDao.findAllByCelebId(celebId);
        List<Long> restaurantIds = videos.stream()
                .filter(it -> it.celebId().equals(celebId))
                .map(Video::restaurantId)
                .toList();
        List<RestaurantSearchResponse> list = store.keySet().stream()
                .filter(restaurantIds::contains)
                .map(store::get)
                .map(RestaurantFixture::toRestaurantSearchResponse)
                .collect(Collectors.toList());
        List<RestaurantSearchResponse> paging =
                list.subList(cond.offset(), Math.min(cond.offset() + cond.limit() + 1, list.size()));
        return new PageResponse<>(
                hasNextPage(cond, paging),
                paging.subList(0, Math.min(cond.size(), paging.size()))
        );
    }

    private boolean hasNextPage(PageCond cond, List<RestaurantSearchResponse> response) {
        return response.size() == cond.limit() + 1;
    }
}
