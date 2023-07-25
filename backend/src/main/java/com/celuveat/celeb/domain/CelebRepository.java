package com.celuveat.celeb.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CelebRepository extends JpaRepository<Celeb, Long> {

    Celeb getByYoutubeChannelName(String youtubeChannelName);
}
