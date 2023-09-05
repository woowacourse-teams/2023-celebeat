package com.celuveat.common.util;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class StreamUtil {

    public static <K, E> Map<K, List<E>> groupBySameOrder(List<E> data, Function<E, K> classifier) {
        return data.stream()
                .collect(groupingBy(
                        classifier,
                        LinkedHashMap::new,
                        toList()
                ));
    }
}
