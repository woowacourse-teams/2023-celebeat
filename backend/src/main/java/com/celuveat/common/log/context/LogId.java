package com.celuveat.common.log.context;

import static com.celuveat.common.auth.AuthConstant.JSESSION_ID;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public interface LogId {

    static LogId fromRequest(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return AnonymousLogId.randomId();
        }
        return new AuthenticatedLogId(session.getAttribute(JSESSION_ID));
    }

    String logId();
}
