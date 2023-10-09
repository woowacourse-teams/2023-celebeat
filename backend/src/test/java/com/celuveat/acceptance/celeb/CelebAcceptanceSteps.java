package com.celuveat.acceptance.celeb;

import static com.celuveat.acceptance.common.AcceptanceSteps.given;
import static org.assertj.core.api.Assertions.assertThat;

import com.celuveat.celeb.command.domain.Celeb;
import com.celuveat.celeb.query.dto.CelebQueryResponse;
import io.restassured.common.mapper.TypeRef;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import java.util.Arrays;
import java.util.List;

public class CelebAcceptanceSteps {

    public static List<CelebQueryResponse> 셀럽조회_결과(Celeb... 셀럽들) {
        return Arrays.stream(셀럽들)
                .map(CelebQueryResponse::from)
                .toList();
    }

    public static ExtractableResponse<Response> 셀럽_전체_조회_요청() {
        return given()
                .when()
                .get("/celebs")
                .then()
                .log().all()
                .extract();
    }

    public static void 셀럽_전체_조회_결과를_검증한다(List<CelebQueryResponse> 예상, ExtractableResponse<Response> 응답) {
        List<CelebQueryResponse> result = 응답.as(new TypeRef<>() {
        });
        assertThat(result).usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(예상);
    }
}
