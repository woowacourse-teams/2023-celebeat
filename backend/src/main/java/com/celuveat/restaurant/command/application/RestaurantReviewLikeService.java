package com.celuveat.restaurant.command.application;

import com.celuveat.auth.command.domain.OauthMember;
import com.celuveat.auth.command.domain.OauthMemberRepository;
import com.celuveat.restaurant.command.domain.review.RestaurantReview;
import com.celuveat.restaurant.command.domain.review.RestaurantReviewLike;
import com.celuveat.restaurant.command.domain.review.RestaurantReviewLikeRepository;
import com.celuveat.restaurant.command.domain.review.RestaurantReviewRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class RestaurantReviewLikeService {

    private final OauthMemberRepository oauthMemberRepository;
    private final RestaurantReviewRepository restaurantReviewRepository;
    private final RestaurantReviewLikeRepository restaurantReviewLikeRepository;

    public void like(Long restaurantReviewId, Long memberId) {
        RestaurantReview restaurantReview = restaurantReviewRepository.getById(restaurantReviewId);
        OauthMember member = oauthMemberRepository.getById(memberId);
        Optional<RestaurantReviewLike> likeHistory =
                restaurantReviewLikeRepository.findByRestaurantReviewAndMember(restaurantReview, member);
        if (likeHistory.isPresent()) {
            cancelLike(restaurantReview, likeHistory.get());
            return;
        }
        clickLike(restaurantReview, member);
    }

    private void cancelLike(RestaurantReview restaurantReview, RestaurantReviewLike restaurantReviewLike) {
        restaurantReview.cancelLike();
        restaurantReviewLikeRepository.delete(restaurantReviewLike);
    }

    private void clickLike(RestaurantReview restaurantReview, OauthMember member) {
        restaurantReview.clickLike();
        restaurantReviewLikeRepository.save(RestaurantReviewLike.create(restaurantReview, member));
    }
}
