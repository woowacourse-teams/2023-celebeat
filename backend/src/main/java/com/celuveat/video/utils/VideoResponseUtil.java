package com.celuveat.video.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VideoResponseUtil {

    private static final Pattern YOUTUBE_VIDEO_KEY_PATTERN =
            Pattern.compile("(?:v=|/shorts/)([a-zA-Z0-9_-]+)");

    public static String extractVideoKey(String videoUrl) {
        Matcher matcher = YOUTUBE_VIDEO_KEY_PATTERN.matcher(videoUrl);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return videoUrl;
    }
}
