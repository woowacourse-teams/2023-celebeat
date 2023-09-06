package com.celuveat.auth.presentation;

import static com.celuveat.auth.command.domain.OauthServerType.KAKAO;
import static com.celuveat.common.auth.AuthConstant.JSESSION_ID;

import com.celuveat.auth.command.domain.OauthId;
import com.celuveat.auth.command.domain.OauthMember;
import com.celuveat.auth.command.domain.OauthMemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("!prod")
@RequiredArgsConstructor
public class LocalAuthController {

    private final OauthMemberRepository oauthMemberRepository;

    @GetMapping("/login/local")
    ResponseEntity<Void> login(@RequestParam String id, HttpServletRequest request) {
        OauthId oauthId = new OauthId(id, KAKAO);
        OauthMember oauthMember = new OauthMember(oauthId, id, null);
        OauthMember savedMember = oauthMemberRepository.findByOauthId(oauthId)
                .orElseGet(() -> oauthMemberRepository.save(oauthMember));
        HttpSession session = request.getSession(true);
        session.setAttribute(JSESSION_ID, savedMember.id());
        return ResponseEntity.ok().build();
    }
}
