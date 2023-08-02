import { styled } from 'styled-components';
import RestaurantCardSkeleton from '../RestaurantCard/RestaurantCardSkeleton';
import { BORDER_RADIUS, paintSkeleton } from '~/styles/common';
import useMediaQuery from '~/hooks/useMediaQuery';

interface RestaurantCardListSkeletonProps {
  cardNumber: number;
}

function RestaurantCardListSkeleton({ cardNumber }: RestaurantCardListSkeletonProps) {
  const { isMobile } = useMediaQuery();

  return (
    <div>
      {!isMobile && <StyledCardListHeader />}
      <StyledRestaurantCardList>
        {Array.from({ length: cardNumber }, () => (
          <RestaurantCardSkeleton />
        ))}
      </StyledRestaurantCardList>
    </div>
  );
}

export default RestaurantCardListSkeleton;

const StyledCardListHeader = styled.p`
  ${paintSkeleton}
  width: 35%;
  height: 16px;

  margin: 3.2rem 2.4rem;

  border-radius: ${BORDER_RADIUS.xs};
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

  @media screen and (width <= 743px) {
    grid-template-columns: 1fr;
  }
`;
