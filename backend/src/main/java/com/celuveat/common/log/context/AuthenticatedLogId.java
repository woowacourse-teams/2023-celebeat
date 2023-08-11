package com.celuveat.common.log.context;

public class AuthenticatedLogId implements LogId {

    private final String memberId;

    public AuthenticatedLogId(Object memberId) {
        this.memberId = String.valueOf(memberId);
    }

    @Override
    public String logId() {
        return memberId + "(memberId)";
    }
}
