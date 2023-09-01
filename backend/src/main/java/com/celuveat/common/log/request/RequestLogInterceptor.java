package com.celuveat.common.log.request;

import com.celuveat.common.log.context.LogContext;
import com.celuveat.common.log.context.LogContextHolder;
import com.celuveat.common.log.context.LogId;
import com.celuveat.common.log.query.QueryCounter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class RequestLogInterceptor implements HandlerInterceptor {

    private static final int QUERY_COUNT_WARNING_STANDARD = 5;
    private static final int TOTAL_TIME_WARNING_STANDARD_MS = 2500;

    private final QueryCounter queryCounter;
    private final LogContextHolder logContextHolder;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (CorsUtils.isPreFlightRequest(request) || isErrorUri(request)) {
            return true;
        }
        LogContext logContext = new LogContext(LogId.fromRequest(request));
        logContextHolder.setLogContext(logContext);
        RequestInfoLogData requestInfoLogData = new RequestInfoLogData(logContext.logId(), request);
        requestInfoLogData.put("Controller Method", handlerMethod((HandlerMethod) handler));
        log.info("[Web Request START] : [{}]", requestInfoLogData);
        return true;
    }

    private boolean isErrorUri(HttpServletRequest request) {
        return request.getRequestURI().equals("/api/error");
    }

    private String handlerMethod(HandlerMethod handler) {
        String className = handler.getMethod().getDeclaringClass().getSimpleName();
        String methodName = handler.getMethod().getName();
        return className + "." + methodName + "()";
    }

    @Override
    public void afterCompletion(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler,
            Exception ex
    ) {
        if (CorsUtils.isPreFlightRequest(request) || isErrorUri(request)) {
            return;
        }
        LogContext logContext = logContextHolder.get();
        long totalTime = logContext.totalTakenTime();
        log.info("[Web Request END] : ID: {}, URI: {}, METHOD: {}, STATUS: {}, 쿼리 개수: {}, 요청 처리 시간: {}ms",
                logContext.logId(),
                request.getRequestURI(),
                request.getMethod(),
                response.getStatus(),
                queryCounter.count(),
                logContext.totalTakenTime()
        );
        logWarning(logContext, totalTime);
    }

    private void logWarning(LogContext logContext, long totalTime) {
        if (queryCounter.count() >= QUERY_COUNT_WARNING_STANDARD) {
            log.warn("[{}] : 쿼리가 {}번 이상 실행되었습니다. (총 {}번)",
                    logContext.logId(),
                    QUERY_COUNT_WARNING_STANDARD,
                    queryCounter.count()
            );
        }
        if (totalTime >= TOTAL_TIME_WARNING_STANDARD_MS) {
            log.warn("[{}] : 요청을 처리하는데 {}ms 이상 소요되었습니다. (총 {}ms)",
                    logContext.logId(),
                    TOTAL_TIME_WARNING_STANDARD_MS,
                    totalTime
            );
        }
    }
}
