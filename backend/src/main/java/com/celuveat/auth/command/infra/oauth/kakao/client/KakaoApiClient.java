package com.celuveat.auth.command.infra.oauth.kakao.client;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE;

import com.celuveat.auth.command.infra.oauth.kakao.dto.KakaoMemberResponse;
import com.celuveat.auth.command.infra.oauth.kakao.dto.KakaoToken;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

public interface KakaoApiClient {

    @PostExchange(url = "https://kauth.kakao.com/oauth/token", contentType = APPLICATION_FORM_URLENCODED_VALUE)
    KakaoToken fetchToken(@RequestParam MultiValueMap<String, String> params);

    @GetExchange(url = "https://kapi.kakao.com/v2/user/me")
    KakaoMemberResponse fetchMember(@RequestHeader(name = AUTHORIZATION) String accessToken);

    @PostExchange(url = "https://kapi.kakao.com/v1/user/logout")
    void logoutMember(
            @RequestHeader(name = AUTHORIZATION) String adminKey,
            @RequestBody MultiValueMap<String, String> params
    );

    @PostExchange(url = "https://kapi.kakao.com/v1/user/unlink")
    void withdrawMember(
            @RequestHeader(name = AUTHORIZATION) String adminKey,
            @RequestBody MultiValueMap<String, String> params
    );
}
