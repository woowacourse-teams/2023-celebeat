package com.celuveat.acceptance.admin;

import static com.celuveat.acceptance.common.AcceptanceSteps.given;
import static io.restassured.http.ContentType.TEXT;
import static java.nio.charset.StandardCharsets.UTF_8;

import com.celuveat.admin.presentation.dto.SaveDataRequest;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import java.util.Arrays;
import java.util.List;

public class AdminAcceptanceSteps {

    public static String 입력_생성(String 셀럽_이름, String 음식점_이름) {
        return "@" + 셀럽_이름 +
                "\t" + 음식점_이름 + "png" +
                "\t유튜브링크" +
                "\t2023. 7. 25." +
                "\t" + 음식점_이름 +
                "\t" + 음식점_이름 + " 주소" +
                "\t전화번호" +
                "\t카테고리" +
                "\t음식점네이버링크" +
                "\t12.3456" +
                "\t12.3456";
    }

    public static List<SaveDataRequest> 요청_생성(String input) {
        String[] rows = input.split(System.lineSeparator());
        return Arrays.stream(rows)
                .map(row -> row.split("\t"))
                .map(SaveDataRequest::from)
                .toList();
    }

    public static ExtractableResponse<Response> 데이터_저장_요청(String data) {
        return given()
                .contentType(TEXT.withCharset(UTF_8))
                .body(data)
                .when().post("/api/admin/data")
                .then().log().all()
                .extract();
    }
}
