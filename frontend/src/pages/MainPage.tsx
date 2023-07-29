import { useCallback, useEffect, useState } from 'react';
import { styled, css } from 'styled-components';
import Footer from '~/components/@common/Footer';
import Header from '~/components/@common/Header';
import Map from '~/components/@common/Map';
import CategoryNavbar from '~/components/CategoryNavbar';
import CelebDropDown from '~/components/CelebDropDown/CelebDropDown';
import RESTAURANT_CATEGORY from '~/constants/restaurantCategory';
import { CELEBS_OPTIONS } from '~/constants/celebs';
import useFetch from '~/hooks/useFetch';
import getQueryString from '~/utils/getQueryString';
import type { Celeb } from '~/@types/celeb.types';
import type { RestaurantListData } from '~/@types/api.types';
import type { CoordinateBoundary } from '~/@types/map.types';
import type { RestaurantCategory } from '~/@types/restaurant.types';
import RestaurantCardList from '~/components/RestaurantCardList';

function MainPage() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [data, setData] = useState<RestaurantListData>(null);
  const [loading, setLoading] = useState(false);
  const [boundary, setBoundary] = useState<CoordinateBoundary>();
  const [celebId, setCelebId] = useState<Celeb['id']>(-1);
  const [restaurantCategory, setRestaurantCategory] = useState<RestaurantCategory>('전체');
  const { handleFetch } = useFetch('restaurants');

  const fetchRestaurants = useCallback(
    async (queryObject: { boundary: CoordinateBoundary; celebId: number; category: RestaurantCategory }) => {
      setLoading(true);
      const queryString = getQueryString(queryObject);
      const response = await handleFetch({ queryString });

      setData(response);
      setLoading(false);
    },
    [boundary, celebId, restaurantCategory],
  );

  const clickRestaurantCategory = (e: React.MouseEvent<HTMLElement>) => {
    const currentCategory = e.currentTarget.dataset.label as RestaurantCategory;

    setRestaurantCategory(currentCategory);
    fetchRestaurants({ boundary, celebId, category: currentCategory });
  };

  const clickCeleb = (e: React.MouseEvent<HTMLElement>) => {
    const currentCelebId = Number(e.currentTarget.dataset.id);

    setCelebId(currentCelebId);
    fetchRestaurants({ boundary, celebId: currentCelebId, category: restaurantCategory });
  };

  const toggleMapExpand = () => {
    setIsMapExpanded(prev => !prev);
  };

  useEffect(() => {
    fetchRestaurants({ boundary, celebId, category: restaurantCategory });
  }, [boundary]);

  return (
    <>
      <Header />
      <StyledNavBar>
        <CelebDropDown celebs={CELEBS_OPTIONS} externalOnClick={clickCeleb} />
        <StyledLine />
        <CategoryNavbar categories={RESTAURANT_CATEGORY} externalOnClick={clickRestaurantCategory} />
      </StyledNavBar>
      <StyledLayout isMapExpanded={isMapExpanded}>
        <StyledLeftSide isMapExpanded={isMapExpanded}>
          <RestaurantCardList restaurantDataList={data} loading={loading} />
        </StyledLeftSide>
        <StyledRightSide>
          <Map setBoundary={setBoundary} data={data?.content} toggleMapExpand={toggleMapExpand} />
        </StyledRightSide>
      </StyledLayout>
      <Footer />
    </>
  );
}

export default MainPage;

const StyledNavBar = styled.div`
  display: flex;
  align-items: center;

  position: sticky;
  top: 80px;
  z-index: 10;

  width: 100%;
  height: 80px;

  background-color: var(--white);
  border-bottom: 1px solid var(--gray-1);
`;

const StyledLine = styled.div`
  width: 1px;
  height: 46px;

  background-color: var(--gray-3);
`;

const StyledLayout = styled.div<{ isMapExpanded: boolean }>`
  display: grid;

  width: 100%;
  height: 100%;
  grid-template-columns: 63% 37%;

  ${({ isMapExpanded }) =>
    isMapExpanded &&
    css`
      grid-template-columns: 100%;
    `}

  @media screen and (width <= 1240px) {
    grid-template-columns: 55% 45%;

    ${({ isMapExpanded }) =>
      isMapExpanded &&
      css`
        grid-template-columns: 100%;
      `}
  }

  @media screen and (width <= 950px) {
    & > div:last-child {
      display: none;
    }

    grid-template-columns: 100% 0;
  }
`;

const StyledLeftSide = styled.div<{ isMapExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  z-index: 0;

  height: 100%;

  ${({ isMapExpanded }) =>
    isMapExpanded &&
    css`
      display: none;
    `}
`;

const StyledRightSide = styled.div`
  position: sticky;
  top: 160px;

  width: 100%;
  height: calc(100vh - 160px);
`;
