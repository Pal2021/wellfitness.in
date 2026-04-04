package com.wellfitness.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PagedResponse<T> {

    private boolean success;
    private List<T> data;
    private String message;
    private Pagination pagination;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pagination {
        private int page;
        private int size;
        private long total;
        private boolean hasNext;
    }

    public static <T> PagedResponse<T> of(List<T> data, int page, int size, long total) {
        return PagedResponse.<T>builder()
                .success(true)
                .data(data)
                .message("Operation successful")
                .pagination(Pagination.builder()
                        .page(page)
                        .size(size)
                        .total(total)
                        .hasNext((long) (page + 1) * size < total)
                        .build())
                .build();
    }
}
