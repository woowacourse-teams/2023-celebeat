package com.celuveat.auth.presentation;

import static com.celuveat.common.auth.AuthConstant.JSESSION_ID;

import com.celuveat.auth.command.application.OauthService;
import com.celuveat.auth.command.domain.OauthServerType;
import com.celuveat.common.auth.Auth;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth")
public class OauthController {

    private final OauthService oauthService;

    @SneakyThrows
    @GetMapping("/{oauthServerType}")
    ResponseEntity<Void> redirectAuthCodeRequestUrl(
            @PathVariable OauthServerType oauthServerType,
            HttpServletResponse response
    ) {
        String redirectUrl = oauthService.getAuthCodeRequestUrl(oauthServerType);
        response.sendRedirect(redirectUrl);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/login/{oauthServerType}")
    ResponseEntity<Void> login(
            @PathVariable OauthServerType oauthServerType,
            @RequestParam("code") String code,
            HttpServletRequest request
    ) {
        Long oauthMemberId = oauthService.login(oauthServerType, code);
        HttpSession session = request.getSession(true);
        session.setAttribute(JSESSION_ID, oauthMemberId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/logout/{oauthServerType}")
    ResponseEntity<Void> logout(
            @Auth Long memberId,
            @PathVariable OauthServerType oauthServerType,
            HttpServletRequest request
    ) {
        oauthService.logout(oauthServerType, memberId);
        request.getSession(false).invalidate();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/withdraw/{oauthServerType}")
    ResponseEntity<Void> withdraw(
            @Auth Long memberId,
            @PathVariable OauthServerType oauthServerType,
            HttpServletRequest request
    ) {
        oauthService.withdraw(oauthServerType, memberId);
        request.getSession(false).invalidate();
        return ResponseEntity.noContent().build();
    }
}
