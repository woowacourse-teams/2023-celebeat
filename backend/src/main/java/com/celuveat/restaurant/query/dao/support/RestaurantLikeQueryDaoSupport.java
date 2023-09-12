package com.celuveat.restaurant.query.dao.support;

import com.celuveat.restaurant.command.domain.Restaurant;
import com.celuveat.restaurant.command.domain.RestaurantLike;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantLikeQueryDaoSupport extends JpaRepository<RestaurantLike, Long> {

    Optional<RestaurantLike> findByRestaurantAndMemberId(Restaurant restaurant, Long memberId);

    List<RestaurantLike> findAllByMemberIdOrderByCreatedDateDesc(Long memberId);

    Integer countByRestaurant(Restaurant restaurant);
}
