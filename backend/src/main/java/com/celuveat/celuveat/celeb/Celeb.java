package com.celuveat.celuveat.celeb;

import lombok.Builder;

@Builder
public record Celeb(
        Long id,
        String name,
        String youtubeId,
        int subscriberCount,
        String link,
        String backgroundImageUrl,
        String profileImageUrl
) {
}
