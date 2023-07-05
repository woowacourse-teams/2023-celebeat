package com.celuveat.celuveat.celeb;

import static com.celuveat.celuveat.celeb.CelebExceptionType.NOT_FOUND_CELEB;
import static com.celuveat.celuveat.celeb.fixture.CelebFixture.히밥;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.DisplayNameGenerator.ReplaceUnderscores;

import com.celuveat.celuveat.common.annotation.DaoTest;
import com.celuveat.celuveat.common.exception.BaseExceptionType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@DaoTest
@DisplayName("CelebDao 은(는)")
@SuppressWarnings("NonAsciiCharacters")
@DisplayNameGeneration(ReplaceUnderscores.class)
class CelebDaoTest {

    @Autowired
    private CelebDao celebDao;

    @Test
    void 셀럽을_저장한다() {
        // given
        Celeb 히밥 = 히밥();

        // when
        Long savedId = celebDao.save(히밥);

        // then
        assertThat(savedId).isNotNull();
    }

    @Test
    void ID로_셀럽을_찾는다() {
        // given
        Celeb 히밥 = 히밥();
        long savedId = celebDao.save(히밥);

        // when
        Celeb result = celebDao.getById(savedId);

        // then
        assertThat(result).usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(히밥);
    }

    @Test
    void 셀럽이_없는_경우_예외가_발생한다() {
        // when
        BaseExceptionType exceptionType = assertThrows(CelebException.class, () ->
                celebDao.getById(1L)
        ).exceptionType();

        // then
        assertThat(exceptionType).isEqualTo(NOT_FOUND_CELEB);
    }
}
