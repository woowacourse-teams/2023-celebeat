package com.celuveat.auth.presentation;

import static com.celuveat.auth.exception.AuthExceptionType.UNAUTHORIZED_REQUEST;
import static com.celuveat.common.auth.AuthConstant.JSESSION_ID;

import com.celuveat.auth.exception.AuthException;
import com.celuveat.common.util.CorsUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private static final String REVIEW_URI_REGEX = "^\\/api\\/reviews.*";

    private final AuthContext authContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (CorsUtil.isPreflightRequest(request)) {
            return true;
        }
        if (isAllowedQueryRequest(request)) {
            return true;
        }
        HttpSession session = getSession(request);
        Long memberId = Optional.ofNullable(session.getAttribute(JSESSION_ID))
                .map(id -> (Long) id)
                .orElseThrow(() -> new AuthException(UNAUTHORIZED_REQUEST));
        authContext.setMemberId(memberId);
        return true;
    }

    private boolean isAllowedQueryRequest(HttpServletRequest request) {
        return request.getMethod().equals(HttpMethod.GET.name())
                && request.getRequestURI().matches(REVIEW_URI_REGEX);
    }

    private HttpSession getSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            throw new AuthException(UNAUTHORIZED_REQUEST);
        }
        return session;
    }
}
