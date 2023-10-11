package com.celuveat.acceptance.common;

import static com.celuveat.acceptance.auth.OauthAcceptanceSteps.로그인_요청;
import static com.celuveat.acceptance.common.AcceptanceSteps.세션_아이디를_가져온다;
import static com.celuveat.auth.command.domain.OauthServerType.KAKAO;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.when;

import com.celuveat.auth.command.application.OauthService;
import com.celuveat.auth.command.domain.OauthMember;
import com.celuveat.auth.command.domain.OauthMemberRepository;
import com.celuveat.celeb.command.domain.Celeb;
import com.celuveat.celeb.command.domain.CelebRepository;
import com.celuveat.common.TestData;
import com.celuveat.common.TestDataInserter;
import com.celuveat.common.client.ImageUploadClient;
import com.celuveat.restaurant.command.application.RestaurantService;
import com.celuveat.restaurant.command.domain.Restaurant;
import com.celuveat.restaurant.command.domain.RestaurantImageRepository;
import com.celuveat.restaurant.command.domain.RestaurantLikeRepository;
import com.celuveat.restaurant.command.domain.RestaurantRepository;
import com.celuveat.restaurant.command.domain.review.RestaurantReview;
import com.celuveat.restaurant.command.domain.review.RestaurantReviewRepository;
import com.celuveat.video.command.domain.VideoRepository;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator.ReplaceUnderscores;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.web.multipart.MultipartFile;

@Sql("/truncate.sql")
@DisplayNameGeneration(ReplaceUnderscores.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public abstract class AcceptanceTest {

    @MockBean
    protected OauthService oauthService;

    @MockBean
    protected ImageUploadClient imageUploadClient;

    @Autowired
    protected CelebRepository celebRepository;

    @Autowired
    protected RestaurantRepository restaurantRepository;

    @Autowired
    protected RestaurantImageRepository restaurantImageRepository;

    @Autowired
    protected VideoRepository videoRepository;

    @Autowired
    protected OauthMemberRepository oauthMemberRepository;

    @Autowired
    protected RestaurantLikeRepository restaurantLikeRepository;

    @Autowired
    protected RestaurantService restaurantService;

    @Autowired
    protected RestaurantReviewRepository restaurantReviewRepository;

    @Autowired
    protected Environment environment;

    @Autowired
    protected TestDataInserter testDataInserter;

    protected final TestData testData = new TestData();

    @LocalServerPort
    protected int port;

    @BeforeEach
    protected void setUp() {
        RestAssured.port = port;
    }

    protected void 초기_데이터_저장() {
        testDataInserter.insertData(testData);
    }

    protected String 회원가입과_로그인후_세션아이디를_가져온다(OauthMember 멤버) {
        var 로그인_결과 = 회원가입후_로그인한다(멤버);
        return 세션_아이디를_가져온다(로그인_결과);
    }

    protected ExtractableResponse<Response> 회원가입후_로그인한다(OauthMember 멤버) {
        회원를_저장한다(멤버);
        String authCode = "authCode";
        when(oauthService.login(KAKAO, authCode)).thenReturn(멤버.id());
        return 로그인_요청(authCode);
    }

    protected String 로그인후_세션아이디를_가져온다(OauthMember 멤버) {
        String authCode = "authCode";
        when(oauthService.login(KAKAO, authCode)).thenReturn(멤버.id());
        return 세션_아이디를_가져온다(로그인_요청(authCode));
    }

    protected void 셀럽을_저장한다(Celeb 셀럽) {
        celebRepository.save(셀럽);
    }

    protected void 셀럽들을_저장한다(Celeb... 셀럽들) {
        List<Celeb> list = Arrays.stream(셀럽들)
                .toList();
        celebRepository.saveAll(list);
    }

    protected OauthMember 회원를_저장한다(OauthMember 멤버) {
        return oauthMemberRepository.save(멤버);
    }

    protected Restaurant 음식점을_저장한다(Restaurant 음식점) {
        return restaurantRepository.save(음식점);
    }

    protected Long 음식점_리뷰를_저장한다(RestaurantReview 음식점_리뷰) {
        return restaurantReviewRepository.save(음식점_리뷰).id();
    }

    protected <T> void 데이터_수_검증(JpaRepository<T, Long> repository, int expected) {
        assertThat(repository.count()).isEqualTo(expected);
    }

    protected void 이미지_업로드를_설정한다(List<MultipartFile> images) {
        willDoNothing().given(imageUploadClient).upload(images);
    }
}
