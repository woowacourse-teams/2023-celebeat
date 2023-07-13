package com.celuveat.celuveat.admin.presentation;

import com.celuveat.celuveat.video.application.VideoHistoryQueryService;
import com.celuveat.celuveat.video.application.dto.FindAllVideoHistoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/videohistories")
public class AdminVideoHistoryController {

    private final VideoHistoryQueryService videoHistoryQueryService;

    @GetMapping
    ResponseEntity<List<FindAllVideoHistoryResponse>> findAllVideoHistory() {
        List<FindAllVideoHistoryResponse> result = videoHistoryQueryService.findAllVideoHistoryResponses();
        return ResponseEntity.ok(result);
    }
}
