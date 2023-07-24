package com.celuveat.restaurant.domain;

import static com.celuveat.common.util.DynamicQueryUtil.appendQueryIfTrue;
import static com.celuveat.common.util.DynamicQueryUtil.notNull;
import static com.celuveat.common.util.StringUtil.removeAllBlank;
import static org.springframework.util.StringUtils.hasText;

import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestaurantQueryRepository {

    private static final String WHERE = "WHERE ";
    private static final String AND = " AND ";

    private static final String CELEB_ID_EQUAL = "c.id = %d";
    private static final String RESTAURANT_CATEGORY_EQUAL = "r.category = '%s'";
    private static final String RESTAURANT_NAME_LIKE_IGNORE_CASE_IGNORE_BLANK = """
            Function('replace', lower(r.name), ' ', '') like lower('%%%s%%')
            """;

    private static final String SELECT_RESTAURANT_JOIN_VIDEO_AND_CELEB = """
            SELECT r
            FROM Restaurant r
            JOIN Video v
            ON v.restaurant = r
            JOIN Celeb c
            ON c = v.celeb
            """;

    private final EntityManager em;

    public List<Restaurant> getRestaurants(RestaurantSearchCond cond) {
        List<String> appendedQuery = new ArrayList<>();
        appendQueryIfTrue(appendedQuery,
                notNull(cond.celebId()),
                CELEB_ID_EQUAL,
                cond.celebId());
        appendQueryIfTrue(appendedQuery,
                hasText(cond.category()),
                RESTAURANT_CATEGORY_EQUAL,
                cond.category());
        appendQueryIfTrue(appendedQuery,
                hasText(cond.restaurantName()),
                RESTAURANT_NAME_LIKE_IGNORE_CASE_IGNORE_BLANK,
                removeAllBlank(cond.restaurantName()));
        String query = createQuery(appendedQuery);
        return em.createQuery(query, Restaurant.class).getResultList();
    }

    private String createQuery(List<String> appendedQuery) {
        if (appendedQuery.isEmpty()) {
            return SELECT_RESTAURANT_JOIN_VIDEO_AND_CELEB;
        }
        return SELECT_RESTAURANT_JOIN_VIDEO_AND_CELEB
               + WHERE
               + String.join(AND, appendedQuery);
    }

    public record RestaurantSearchCond(
            Long celebId,
            String category,
            String restaurantName
    ) {
    }
}

