package com.celuveat.admin.command.application;

import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.데이터_입력_생성;
import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.데이터저장_요청_객체_생성;
import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.셀럽_입력_생성;
import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.셀럽_저장_요청_생성;
import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.영상_업로드_날짜가_잘못된_입력_생성;
import static com.celuveat.acceptance.admin.AdminAcceptanceSteps.줄바꿈;
import static com.celuveat.admin.exception.AdminExceptionType.EXIST_NULL;
import static com.celuveat.admin.exception.AdminExceptionType.ILLEGAL_DATE_FORMAT;
import static com.celuveat.admin.exception.AdminExceptionType.INVALID_URL_PATTERN;
import static com.celuveat.admin.exception.AdminExceptionType.MISMATCH_COUNT_YOUTUBE_VIDEO_LINK_AND_UPLOAD_DATE;
import static com.celuveat.celeb.exception.CelebExceptionType.NOT_FOUND_CELEB;
import static com.celuveat.celeb.fixture.CelebFixture.셀럽;
import static com.celuveat.restaurant.command.domain.SocialMedia.INSTAGRAM;
import static com.celuveat.restaurant.command.domain.SocialMedia.YOUTUBE;
import static com.celuveat.restaurant.fixture.RestaurantFixture.하늘초밥;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.celuveat.acceptance.admin.AdminAcceptanceSteps;
import com.celuveat.admin.exception.AdminException;
import com.celuveat.admin.presentation.dto.SaveCelebRequest;
import com.celuveat.admin.presentation.dto.SaveDataRequest;
import com.celuveat.celeb.command.domain.Celeb;
import com.celuveat.celeb.exception.CelebException;
import com.celuveat.common.IntegrationTest;
import com.celuveat.common.exception.BaseExceptionType;
import com.celuveat.restaurant.command.domain.RestaurantImage;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@DisplayName("어드민 서비스(AdminService) 은(는)")
class AdminServiceTest extends IntegrationTest {

    @Nested
    class 음식점_데이터_저장 {

        // TODO : 수정 필요
        @Disabled
        @Test
        void 셀럽과_음식점이_저장되어_있고_데이터_두_개를_저장한다_한_개는_존재하는_음식점이고_나머지_하나는_존재하지_않는다() {
            // given
            celebRepository.save(셀럽("도기"));
            restaurantRepository.save(하늘초밥());

            String rawData = AdminAcceptanceSteps.데이터_입력_생성("도기", "국민연금")
                    + 줄바꿈
                    + AdminAcceptanceSteps.데이터_입력_생성("도기", "농민백암순대");
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            adminService.saveData(요청);

            // then
            assertThat(celebRepository.count()).isEqualTo(1);
            assertThat(restaurantRepository.count()).isEqualTo(2);
            assertThat(restaurantImageRepository.count()).isEqualTo(2);
            assertThat(videoRepository.count()).isEqualTo(2);
        }

        // TODO: 수정 필요
        @Disabled
        @Test
        void 음식점이_이미_저장되어_있고_데이터_두_개를_저장한다_둘_다_같은_음식점_데이터이지만_다른_셀럽이다() {
            // given
            celebRepository.save(셀럽("도기"));
            celebRepository.save(셀럽("로이스"));
            restaurantRepository.save(하늘초밥());

            String rawData = AdminAcceptanceSteps.데이터_입력_생성("도기", "국민연금")
                    + 줄바꿈
                    + AdminAcceptanceSteps.데이터_입력_생성("로이스", "국민연금");
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            adminService.saveData(요청);

            // then
            assertThat(celebRepository.count()).isEqualTo(2);
            assertThat(restaurantRepository.count()).isEqualTo(1);
            assertThat(restaurantImageRepository.count()).isEqualTo(2);
            assertThat(videoRepository.count()).isEqualTo(2);
        }

        @Test
        void 데이터_한_개를_저장한다() {
            // given
            celebRepository.save(셀럽("도기"));
            String rawData = AdminAcceptanceSteps.데이터_입력_생성("도기", "국민연금");
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            adminService.saveData(요청);

            // then
            assertThat(celebRepository.count()).isEqualTo(1);
            assertThat(restaurantRepository.count()).isEqualTo(1);
            assertThat(restaurantImageRepository.count()).isEqualTo(1);
            assertThat(videoRepository.count()).isEqualTo(1);
        }

        @Test
        void 인스타_아이디가_입력되지_않으면_socialMedia는_YOUTUBE로_저장된다() {
            // given
            celebRepository.save(셀럽("도기"));
            String rawData = 데이터_입력_생성("도기", "국민연금");
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            adminService.saveData(요청);

            // then
            RestaurantImage restaurantImage = restaurantImageRepository.findById(1L).get();
            assertThat(restaurantImage.socialMedia()).isEqualTo(YOUTUBE);
        }

        @Test
        void 인스타_아이디가_입력되면_해당_정보가_저장된다() {
            // given
            String instagramName = "doggy";
            celebRepository.save(셀럽("도기"));
            String rawData = 데이터_입력_생성("도기", "국민연금", instagramName);
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            adminService.saveData(요청);

            // then
            RestaurantImage restaurantImage = restaurantImageRepository.getReferenceById(1L);
            assertAll(
                    () -> assertThat(restaurantImage.socialMedia()).isEqualTo(INSTAGRAM),
                    () -> assertThat(restaurantImage.author()).isEqualTo(instagramName)
            );
        }

        @ParameterizedTest
        @ValueSource(strings = {"23. 7. 23.", "2023.7.23", "2023. 7.8."})
        void 날짜_형식이_잘못되면_예외가_발생한다(String 영상_업로드_날짜) {
            // given
            celebRepository.save(셀럽("도기"));
            String rawData = 영상_업로드_날짜가_잘못된_입력_생성("도기", "농민백암순대", 영상_업로드_날짜);
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // then
            BaseExceptionType exceptionType = assertThrows(AdminException.class,
                    () -> adminService.saveData(요청)).exceptionType();
            assertThat(exceptionType).isEqualTo(ILLEGAL_DATE_FORMAT);
        }

        @Test
        void 셀럽이_저장되어_있지_않으면_예외가_발생한다() {
            // given
            String rawData = 데이터_입력_생성("도기", "국민연금");
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // then
            BaseExceptionType exceptionType = assertThrows(CelebException.class,
                    () -> adminService.saveData(요청)).exceptionType();
            assertThat(exceptionType).isEqualTo(NOT_FOUND_CELEB);
        }

        @Test
        void 둘_이상의_유튜브_영상_링크를_한번에_저장할_수_있다() {
            // given
            celebRepository.save(셀럽("도기"));
            String rawData = 데이터_입력_생성(
                    "도기",
                    "국민연금",
                    "영상링크1, 영상링크2",
                    "1987. 6. 8., 1945. 4. 15.",
                    "doggy"
            );
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            adminService.saveData(요청);

            // then
            assertThat(celebRepository.count()).isEqualTo(1);
            assertThat(restaurantRepository.count()).isEqualTo(1);
            assertThat(restaurantImageRepository.count()).isEqualTo(1);
            assertThat(videoRepository.count()).isEqualTo(2);
        }

        @Test
        void 영상_링크와_업로드_일의_수가_다르면_예외가_발생한다() {
            // given
            celebRepository.save(셀럽("도기"));
            String rawData = 데이터_입력_생성(
                    "도기",
                    "국민연금",
                    "영상링크1, 영상링크2",
                    "1987. 6. 8., 1945. 4. 15., 2023. 8. 31.",
                    "doggy"
            );
            List<SaveDataRequest> 요청 = 데이터저장_요청_객체_생성(rawData);

            // when
            BaseExceptionType exceptionType = assertThrows(AdminException.class,
                    () -> adminService.saveData(요청)).exceptionType();
            assertThat(exceptionType).isEqualTo(MISMATCH_COUNT_YOUTUBE_VIDEO_LINK_AND_UPLOAD_DATE);
        }

        @Test
        @Disabled
            // TODO: 해당 케이스 구현
        void 사진_수와_인스타_아이디의_수가_다르면_예외가_발생한다() {
            // given

            // when

            // then
        }

        @Test
        @Disabled
            // TODO: 해당 케이스 구현
        void 동일한_음식점과_유튜브영상링크와_네이버링크가_이미_저장되어_있으면_예외가_발생한다() {
            // given

            // when

            // then
        }

        @Test
        @Disabled
            // TODO: 해당 케이스 구현
        void Image의_author에_저장할때_앞에_골뱅이를_붙여_저장한다() {
            // given

            // when

            // then
        }
    }

    @Nested
    class 셀럽_저장 {

        @Test
        void 셀럽_저장() {
            // given
            String rawData = 셀럽_입력_생성("도기")
                    + 줄바꿈
                    + 셀럽_입력_생성("로이스");
            List<SaveCelebRequest> 요청 = 셀럽_저장_요청_생성(rawData);

            // when
            adminService.saveCelebs(요청);

            // then
            List<Celeb> expected = List.of(셀럽("도기"), 셀럽("로이스"));
            assertThat(celebRepository.count()).isEqualTo(2);
            assertThat(celebRepository.findAll()).usingRecursiveComparison()
                    .comparingOnlyFields("name")
                    .isEqualTo(expected);
        }

        @Test
        void 셀럽_이름이_누락되면_예외가_발생한다() {
            // given
            String 입력_데이터 = "\t@도기\thttps://이미지";

            // then
            BaseExceptionType exceptionType = assertThrows(AdminException.class,
                    () -> 셀럽_저장_요청_생성(입력_데이터)).exceptionType();
            assertThat(exceptionType).isEqualTo(EXIST_NULL);
        }

        @Test
        void 셀럽의_유튜브_채널_이름이_누락되면_예외가_발생한다() {
            // given
            String 입력_데이터 = "도기\t\thttps://이미지";

            // then
            BaseExceptionType exceptionType = assertThrows(AdminException.class,
                    () -> 셀럽_저장_요청_생성(입력_데이터)).exceptionType();
            assertThat(exceptionType).isEqualTo(EXIST_NULL);
        }

        @Test
        void 셀럽의_프로필_사진_URL이_누락되면_예외가_발생한다() {
            // given
            String 입력_데이터 = "도기\t@도기\t";

            // then
            BaseExceptionType exceptionType = assertThrows(AdminException.class,
                    () -> 셀럽_저장_요청_생성(입력_데이터)).exceptionType();
            assertThat(exceptionType).isEqualTo(EXIST_NULL);
        }

        @Test
        void 데이터_순서가_다르면_예외가_발생한다() {
            // given
            String 입력_데이터 = "https://\t@도기\t@도기";

            // then
            BaseExceptionType exceptionType = assertThrows(AdminException.class,
                    () -> 셀럽_저장_요청_생성(입력_데이터)).exceptionType();
            assertThat(exceptionType).isEqualTo(INVALID_URL_PATTERN);
        }
    }
}
