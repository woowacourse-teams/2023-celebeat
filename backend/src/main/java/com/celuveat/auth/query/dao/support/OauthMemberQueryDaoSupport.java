package com.celuveat.auth.query.dao.support;

import static com.celuveat.auth.exception.AuthExceptionType.NOT_FOUND_MEMBER;

import com.celuveat.auth.command.domain.OauthMember;
import com.celuveat.auth.exception.AuthException;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OauthMemberQueryDaoSupport extends JpaRepository<OauthMember, Long> {

    default OauthMember getById(Long id) {
        return findById(id).orElseThrow(() -> new AuthException(NOT_FOUND_MEMBER));
    }
}
