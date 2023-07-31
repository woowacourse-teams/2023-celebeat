import { useCallback, useEffect, useState } from 'react';
import { styled, css } from 'styled-components';
import Footer from '~/components/@common/Footer';
import Header from '~/components/@common/Header';
import Map from '~/components/@common/Map';
import CategoryNavbar from '~/components/CategoryNavbar';
import CelebDropDown from '~/components/CelebDropDown/CelebDropDown';
import RestaurantCard from '~/components/RestaurantCard';
import RESTAURANT_CATEGORY from '~/constants/restaurantCategory';
import { CELEBS_OPTIONS } from '~/constants/celebs';
import useFetch from '~/hooks/useFetch';
import getQueryString from '~/utils/getQueryString';
import { FONT_SIZE } from '~/styles/common';

import type { Celeb } from '~/@types/celeb.types';
import type { RestaurantData } from '~/@types/api.types';
import type { CoordinateBoundary } from '~/@types/map.types';
import type { RestaurantCategory } from '~/@types/restaurant.types';

function MainPage() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [data, setData] = useState<RestaurantData[]>([]);
  const [boundary, setBoundary] = useState<CoordinateBoundary>();
  const [celebId, setCelebId] = useState<Celeb['id']>(-1);
  const [restaurantCategory, setRestaurantCategory] = useState<RestaurantCategory>('전체');
  const [isHoveredList, setIsHoveredList] = useState<{ cardId: number; isHovered: boolean }[]>([]);
  const { handleFetch } = useFetch('restaurants');

  const fetchRestaurants = useCallback(
    async (queryObject: { boundary: CoordinateBoundary; celebId: number; category: RestaurantCategory }) => {
      const queryString = getQueryString(queryObject);
      const response = await handleFetch({ queryString });
      const { content }: { content: RestaurantData[] } = response;

      setData(content);
      const newIsHoveredList = content?.map(restaurant => ({ cardId: restaurant.id, isHovered: false }));
      setIsHoveredList(newIsHoveredList);
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

  const hoverRestaurantCard = (targetId: number) => {
    setIsHoveredList(prev =>
      prev.map(item => (item.cardId === targetId ? { cardId: item.cardId, isHovered: true } : item)),
    );
  };

  const unHoverRestaurantCard = () => {
    setIsHoveredList(prev => prev.map(item => ({ cardId: item.cardId, isHovered: false })));
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
          <StyledCardListHeader>음식점 수 {data.length} 개</StyledCardListHeader>
          <StyledRestaurantCardList>
            {data?.map(({ celebs, ...restaurant }: RestaurantData) => (
              <RestaurantCard
                restaurant={restaurant}
                celebs={celebs}
                size={42}
                onMouseEnter={hoverRestaurantCard}
                onMouseLeave={unHoverRestaurantCard}
              />
            ))}
          </StyledRestaurantCardList>
        </StyledLeftSide>
        <StyledRightSide>
          <Map setBoundary={setBoundary} data={data} toggleMapExpand={toggleMapExpand} isHoveredList={isHoveredList} />
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

const StyledCardListHeader = styled.p`
  margin: 2.4rem 2.4rem 0;

  font-size: ${FONT_SIZE.md};
`;

const StyledRestaurantCardList = styled.div`
  display: grid;
  gap: 4rem 2.4rem;

  height: 100%;

  margin: 0 2.4rem;
  grid-template-columns: 1fr 1fr 1fr;

  @media screen and (width <= 1240px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledRightSide = styled.div`
  position: sticky;
  top: 160px;

  width: 100%;
  height: calc(100vh - 160px);
`;
