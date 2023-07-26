package com.celuveat.admin.application;

import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.요청_생성;
import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.입력_생성;
import static com.celuveat.celeb.fixture.CelebFixture.셀럽;
import static com.celuveat.restaurant.fixture.RestaurantFixture.국민연금_구내식당;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.celuveat.admin.exception.AdminException;
import com.celuveat.admin.presentation.dto.SaveDataRequest;
import com.celuveat.celeb.domain.Celeb;
import com.celuveat.celeb.domain.CelebRepository;
import com.celuveat.restaurant.domain.Restaurant;
import com.celuveat.restaurant.domain.RestaurantImageRepository;
import com.celuveat.restaurant.domain.RestaurantRepository;
import com.celuveat.video.domain.VideoRepository;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator.ReplaceUnderscores;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@SpringBootTest
@Sql("/truncate.sql")
@DisplayName("AdminService 은(는)")
@DisplayNameGeneration(ReplaceUnderscores.class)
class AdminServiceTest {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CelebRepository celebRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantImageRepository restaurantImageRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Test
    void 저장되어_있지_않은_셀럽으로_데이터를_저장하면_예외가_발생한다() {
        // given
        String input = 입력_생성("도기", "국민연금");
        List<SaveDataRequest> 요청 = 요청_생성(input);

        // then
        assertThatThrownBy(() -> adminService.saveData(요청))
                .isInstanceOf(AdminException.class);
    }

    @Test
    void 셀럽과_음식점이_저장되어_있고_데이터_두_개를_저장한다_한_개는_존재하는_음식점이고_나머지_하나는_존재하지_않는다() {
        // given
        셀럽_저장(셀럽("도기"));
        음식점_저장(국민연금_구내식당);

        String input = 입력_생성("도기", "국민연금")
                + System.lineSeparator()
                + 입력_생성("도기", "농민백암순대");
        List<SaveDataRequest> 요청 = 요청_생성(input);

        // when
        adminService.saveData(요청);

        // then
        assertThat(celebRepository.count()).isEqualTo(1);
        assertThat(restaurantRepository.count()).isEqualTo(2);
        assertThat(restaurantImageRepository.count()).isEqualTo(2);
        assertThat(videoRepository.count()).isEqualTo(2);
    }

    @Test
    void 음식점이_이미_저장되어_있고_데이터_두_개를_저장한다_둘_다_같은_음식점_데이터이지만_다른_셀럽이다() {
        // given
        셀럽_저장(셀럽("도기"));
        셀럽_저장(셀럽("로이스"));
        음식점_저장(국민연금_구내식당);

        String input = 입력_생성("도기", "국민연금")
                + System.lineSeparator()
                + 입력_생성("로이스", "국민연금");
        List<SaveDataRequest> 요청 = 요청_생성(input);

        // when
        adminService.saveData(요청);

        // then
        assertThat(celebRepository.count()).isEqualTo(2);
        assertThat(restaurantRepository.count()).isEqualTo(1);
        assertThat(restaurantImageRepository.count()).isEqualTo(2);
        assertThat(videoRepository.count()).isEqualTo(2);
    }

    @Test
    void 셀럽만_저장되어_있고_데이터_한_개를_저장한다() {
        // given
        셀럽_저장(셀럽("도기"));

        String input = 입력_생성("도기", "국민연금");
        List<SaveDataRequest> 요청 = 요청_생성(input);

        // when
        adminService.saveData(요청);

        // then
        assertThat(celebRepository.count()).isEqualTo(1);
        assertThat(restaurantRepository.count()).isEqualTo(1);
        assertThat(restaurantImageRepository.count()).isEqualTo(1);
        assertThat(videoRepository.count()).isEqualTo(1);
    }

    private Celeb 셀럽_저장(Celeb 셀럽) {
        return celebRepository.save(셀럽);
    }

    private Restaurant 음식점_저장(Restaurant 음식점) {
        return restaurantRepository.save(음식점);
    }
}
