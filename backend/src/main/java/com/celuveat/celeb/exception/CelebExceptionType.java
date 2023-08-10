package com.celuveat.celeb.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import com.celuveat.common.exception.BaseExceptionType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public enum CelebExceptionType implements BaseExceptionType {

    NOT_FOUND_CELEB(BAD_REQUEST, "음식점을 찾을 수 없습니다"),
    ;

    private final HttpStatus httpStatus;
    private final String errorMessage;

    @Override
    public HttpStatus httpStatus() {
        return httpStatus;
    }

    @Override
    public String errorMessage() {
        return errorMessage;
    }
}
