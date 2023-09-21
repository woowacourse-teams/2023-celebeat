import { shallow } from 'zustand/shallow';
import { useQuery } from '@tanstack/react-query';
import getQuadrant from '~/utils/getQuadrant';
import OverlayMarker from './OverlayMarker';
import useRestaurantsQueryStringState from '~/hooks/store/useRestaurantsQueryStringState';
import { getRestaurants } from '~/api/restaurant';
import type { RestaurantListData } from '~/@types/api.types';
import type { Coordinate } from '~/@types/map.types';

interface OverlayMarkerListProps {
  center: Coordinate;
  map?: google.maps.Map;
}

function OverlayMarkerList({ center, map }: OverlayMarkerListProps) {
  const [boundary, celebId, currentPage, restaurantCategory, sort] = useRestaurantsQueryStringState(
    state => [state.boundary, state.celebId, state.currentPage, state.restaurantCategory, state.sort],
    shallow,
  );

  const { data, isLoading } = useQuery<RestaurantListData>({
    queryKey: ['restaurants', boundary, celebId, restaurantCategory, currentPage, sort],
    queryFn: () => getRestaurants({ boundary, celebId, category: restaurantCategory, page: currentPage, sort }),
  });

  if (isLoading) return <div>로딩중입니다...</div>;

  return (
    map &&
    data.content?.map(({ celebs, ...restaurant }) => (
      <OverlayMarker
        map={map}
        restaurant={restaurant}
        celeb={celebs[0]}
        quadrant={getQuadrant(center, { lat: restaurant.lat, lng: restaurant.lng })}
      />
    ))
  );
}

export default OverlayMarkerList;
