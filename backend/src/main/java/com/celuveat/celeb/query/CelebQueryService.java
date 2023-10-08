package com.celuveat.celeb.query;

import com.celuveat.celeb.query.dao.CelebQueryResponseDao;
import com.celuveat.celeb.query.dto.CelebQueryResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CelebQueryService {

    private final CelebQueryResponseDao celebQueryResponseDao;

    public List<CelebQueryResponse> find() {
        return celebQueryResponseDao.find();
    }
}
