import { Suspense, useEffect, useRef } from 'react';
import { styled, css } from 'styled-components';

import Map from '~/components/@common/Map';
import RestaurantCardList from '~/components/RestaurantCardList';
import MapPageNavBar, { MapPageNavBarSkeleton } from '~/components/MapPageNavBar';
import useBooleanState from '~/hooks/useBooleanState';
import useMediaQuery from '~/hooks/useMediaQuery';
import MobileMapPage from './MobileMapPage';
import LoadingIndicator from '~/components/@common/LoadingIndicator';
import RESTAURANT_CATEGORY from '~/constants/restaurantCategory';
import useBottomNavBarState from '~/hooks/store/useBottomNavBarState';

function MapPage() {
  const ref = useRef<HTMLDivElement>();
  const { isMobile } = useMediaQuery();
  const { value: isMapExpanded, toggle: toggleExpandedMap } = useBooleanState(false);
  const setMapSelected = useBottomNavBarState(state => state.setMapSelected);

  const scrollTop = () => {
    ref.current.scrollTo(0, 0);
  };

  useEffect(() => {
    setMapSelected();
  }, []);

  if (isMobile)
    return (
      <Suspense
        fallback={
          <StyledProcessing>
            <LoadingIndicator size={32} />
          </StyledProcessing>
        }
      >
        <MobileMapPage />
      </Suspense>
    );

  return (
    <>
      <Suspense fallback={<MapPageNavBarSkeleton navItemLength={RESTAURANT_CATEGORY.length} />}>
        <MapPageNavBar />
      </Suspense>
      <StyledLayout isMapExpanded={isMapExpanded}>
        <StyledLeftSide isMapExpanded={isMapExpanded} ref={ref}>
          <RestaurantCardList scrollTop={scrollTop} />
        </StyledLeftSide>
        <StyledRightSide>
          <Map toggleMapExpand={toggleExpandedMap} />
        </StyledRightSide>
      </StyledLayout>
    </>
  );
}

export default MapPage;

const StyledLayout = styled.main<{ isMapExpanded: boolean }>`
  display: grid;

  width: 100%;
  height: calc(100vh - 150px);

  grid-template-columns: 63vw 37vw;

  ${({ isMapExpanded }) =>
    isMapExpanded &&
    css`
      grid-template-columns: 100vw;
    `}

  @media screen and (width <= 1240px) {
    grid-template-columns: 55vw 45vw;

    ${({ isMapExpanded }) =>
      isMapExpanded &&
      css`
        grid-template-columns: 100vw;
      `}
  }
`;

const StyledLeftSide = styled.section<{ isMapExpanded: boolean }>`
  z-index: 0;

  width: 100%;
  height: 100%;
  overflow-y: scroll;

  ${({ isMapExpanded }) =>
    isMapExpanded &&
    css`
      display: none;
    `}
`;

const StyledRightSide = styled.section`
  position: relative;

  width: 100%;
  height: 100%;
`;

const StyledProcessing = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
`;
