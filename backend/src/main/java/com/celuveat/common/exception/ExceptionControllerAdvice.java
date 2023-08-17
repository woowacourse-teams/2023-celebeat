package com.celuveat.common.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import com.celuveat.common.log.context.LogContext;
import com.celuveat.common.log.context.LogContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionControllerAdvice {

    private final LogContextHolder logContextHolder;

    @ExceptionHandler(BaseException.class)
    ResponseEntity<ExceptionResponse> handleException(HttpServletRequest request, BaseException e) {
        BaseExceptionType type = e.exceptionType();
        LogContext logContext = logContextHolder.get();
        log.info("[{}] 잘못된 요청이 들어왔습니다. URI: {},  내용:  {}",
                logContext.logId(), request.getRequestURI(), type.errorMessage());
        return ResponseEntity.status(type.httpStatus())
                .body(new ExceptionResponse(type.errorMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ExceptionResponse> handleMethodArgumentNotValid(HttpServletRequest request,
                                                                   MethodArgumentNotValidException e) {
        String errorMessage = e.getFieldErrors().stream()
                .map(it -> it.getField() + " : " + it.getDefaultMessage())
                .collect(Collectors.joining("  "));
        LogContext logContext = logContextHolder.get();
        log.info("[{}] 잘못된 요청이 들어왔습니다. URI: {},  내용:  {}",
                logContext.logId(), request.getRequestURI(), errorMessage);
        return ResponseEntity.status(BAD_REQUEST)
                .body(new ExceptionResponse(errorMessage));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    ResponseEntity<ExceptionResponse> handleMissingParams(MissingServletRequestParameterException e) {
        LogContext logContext = logContextHolder.get();
        String errorMessage = e.getParameterName() + " 값이 누락 되었습니다.";
        log.info("[{}] 잘못된 요청이 들어왔습니다. 내용:  {}", logContext.logId(), errorMessage);
        return ResponseEntity.status(BAD_REQUEST)
                .body(new ExceptionResponse(errorMessage));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ExceptionResponse> handleException(HttpServletRequest request, Exception e) {
        LogContext logContext = logContextHolder.get();
        log.error("[{}] 예상하지 못한 예외가 발생했습니다. URI: {}, ",
                logContext.logId(), request.getRequestURI(), e);
        return ResponseEntity.internalServerError()
                .body(new ExceptionResponse("알 수 없는 오류가 발생했습니다."));
    }
}
