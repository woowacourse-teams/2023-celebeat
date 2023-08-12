import { styled } from 'styled-components';
import { Wrapper } from '@googlemaps/react-wrapper';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MouseEventHandler } from 'react';
import View from '~/assets/icons/view.svg';
import Copy from '~/assets/icons/copy.svg';
import Pencil from '~/assets/icons/pencil.svg';
import WhiteLove from '~/assets/icons/love.svg';
import Love from '~/assets/icons/black-love.svg';
import Naver from '~/assets/icons/oauth/naver.svg';
import Youtube from '~/assets/icons/youtube.svg';

import Footer from '~/components/@common/Footer';
import Header from '~/components/@common/Header';
import ImageGrid from '~/components/@common/ImageGrid';
import { BORDER_RADIUS, FONT_SIZE, hideScrollBar } from '~/styles/common';
import VideoCarousel from '~/components/@common/VideoCarousel';
import RestaurantCard from '~/components/RestaurantCard';
import MapContent from '~/components/@common/Map/MapContent';
import ProfileImageList from '~/components/@common/ProfileImageList';
import { getCelebVideo, getNearByRestaurant, getRestaurantDetail, getRestaurantVideo } from '~/api';
import type { RestaurantDetailData, RestaurantListData, VideoList } from '~/@types/api.types';

function RestaurantDetail() {
  const { id: restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const celebId = searchParams.get('celebId');

  const {
    data: {
      name,
      viewCount,
      likeCount,
      images,
      celebs,
      roadAddress,
      category,
      phoneNumber,
      naverMapUrl,
      lat,
      lng,
    } = {},
    isSuccess: isSuccessRestaurantDetail,
  } = useQuery<RestaurantDetailData>({
    queryKey: ['restaurantDetail', restaurantId, celebId],
    queryFn: async () => getRestaurantDetail(restaurantId, celebId),
  });

  const { data: nearByRestaurant, isSuccess: isSuccessNearByRestaurant } = useQuery<RestaurantListData>({
    queryKey: ['nearByRestaurant', restaurantId],
    queryFn: async () => getNearByRestaurant(restaurantId),
  });

  const { data: celebVideo, isSuccess: isSuccessCelebVideo } = useQuery<VideoList>({
    queryKey: ['celebVideo', celebId],
    queryFn: async () => getCelebVideo(celebId),
  });

  const { data: restaurantVideo, isSuccess: isSuccessRestaurantVideo } = useQuery<VideoList>({
    queryKey: ['restaurantVideo', restaurantId],
    queryFn: async () => getRestaurantVideo(restaurantId),
  });

  const openNewWindow =
    (url: string): MouseEventHandler<HTMLButtonElement> =>
    () =>
      window.open(url, '_blank');

  const copyClipBoard =
    (text: string): MouseEventHandler<HTMLButtonElement> =>
    async () => {
      try {
        await navigator.clipboard.writeText(text);
        alert('클립보드에 복사되었어요.');
      } catch (err) {
        alert('복사하는데 문제가 생겼어요.');
      }
    };

  return (
    <>
      <Header />
      <>
        <StyledMainRestaurantDetail>
          {isSuccessRestaurantDetail && (
            <>
              <StyledDetailHeader>
                <h3>{name}</h3>
                <div>
                  <div>
                    <View width={18} /> {viewCount}
                  </div>
                  <div>
                    <Love width={18} /> {likeCount}
                  </div>
                </div>
              </StyledDetailHeader>
              <ImageGrid images={images.map(({ name: url, author }) => ({ waterMark: author, url }))} />
              <StyledDetailAndLink>
                <StyledDetailInfo>
                  <div>
                    <div>
                      <h4>셀럽, {celebs[0].name} 이(가) 다녀간 맛집</h4>
                      <div>
                        <div>{celebs[0].youtubeChannelName}</div>
                        <div>|</div>
                        <button
                          type="button"
                          onClick={openNewWindow(`https://www.youtube.com/${celebs[0].youtubeChannelName}`)}
                        >
                          <Youtube width={18} />
                          <div>유튜브 바로가기</div>
                        </button>
                      </div>
                    </div>
                    <ProfileImageList celebs={celebs} size="56px" />
                  </div>
                  <div>
                    <div>
                      <div>주소 : {roadAddress}</div>
                      <button type="button" onClick={copyClipBoard(roadAddress)}>
                        <Copy width={16} />
                        <div>복사하기</div>
                      </button>
                    </div>
                    <div>
                      <div>전화번호 : {phoneNumber === '' ? '아직 등록되지 않았어요.' : phoneNumber}</div>
                      <button type="button" onClick={copyClipBoard(phoneNumber)}>
                        <Copy width={16} />
                        <div>복사하기</div>
                      </button>
                    </div>
                    <div>카테고리 : {category}</div>
                  </div>
                  {isSuccessRestaurantVideo && (
                    <StyledMainVideo>
                      <h5>영상으로 보기</h5>
                      <iframe
                        title={`${restaurantVideo.content[0].name}의 영상`}
                        src={`https://www.youtube.com/embed/${restaurantVideo.content[0].youtubeVideoKey}`}
                        allow="encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </StyledMainVideo>
                  )}
                </StyledDetailInfo>
                <StyledLinkContainer>
                  <StyledMainLinkContainer>
                    <button type="button" onClick={openNewWindow(naverMapUrl)}>
                      <Naver width={32} />
                      <div>네이버 지도로 보기</div>
                    </button>
                    <button type="button" onClick={openNewWindow(naverMapUrl)}>
                      <WhiteLove width={30} />
                      <div>위시리스트에 저장하기</div>
                    </button>
                  </StyledMainLinkContainer>
                  <button type="button" onClick={openNewWindow(naverMapUrl)}>
                    <Pencil width={16} />
                    <div>정보 수정 제안하기</div>
                  </button>
                </StyledLinkContainer>
              </StyledDetailAndLink>
            </>
          )}

          <StyledVideoSection>
            {isSuccessRestaurantVideo && restaurantVideo.totalElementsCount > 1 && (
              <VideoCarousel
                title={`이외에 ${restaurantVideo.currentElementsCount - 1}명의 셀럽이 다녀갔어요!`}
                videos={restaurantVideo.content.slice(1)}
              />
            )}
            {isSuccessCelebVideo && isSuccessCelebVideo && (
              <VideoCarousel
                title="이 셀럽의 다른 음식점 영상"
                videos={celebVideo.content.filter(({ videoId }) => videoId !== restaurantVideo.content[0].videoId)}
              />
            )}
          </StyledVideoSection>

          {isSuccessNearByRestaurant && (
            <StyledNearByRestaurant>
              <h5>주변 다른 식당</h5>
              <ul>
                {nearByRestaurant.content.map(restaurant => (
                  <RestaurantCard type="map" restaurant={restaurant} celebs={restaurant.celebs} size="36px" />
                ))}
              </ul>
            </StyledNearByRestaurant>
          )}
          {isSuccessRestaurantDetail && (
            <StyledMapSection>
              <h5>위치 확인하기</h5>
              <div>
                <Wrapper apiKey={process.env.GOOGLE_MAP_API_KEY} language="ko" libraries={['places']}>
                  <MapContent
                    center={{ lat, lng }}
                    zoom={17}
                    style={{ width: '100%', height: '600px' }}
                    markers={[{ lat, lng }]}
                  />
                </Wrapper>
              </div>
            </StyledMapSection>
          )}
        </StyledMainRestaurantDetail>
        <Footer />
      </>
    </>
  );
}

export default RestaurantDetail;

const StyledMainRestaurantDetail = styled.main`
  display: flex;
  flex-direction: column;

  max-width: 1240px;

  margin: 0 auto;

  @media screen and (width <= 1340px) {
    margin: 0 5rem;
  }
`;

const StyledDetailHeader = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.8rem 0;

  padding: 2.4rem 0;

  & > div {
    display: flex;
    align-items: center;
    gap: 0 0.8rem;

    font-size: ${FONT_SIZE.md};

    & > div {
      display: flex;
      align-items: center;
      gap: 0 0.8rem;
    }
  }
`;

const StyledDetailAndLink = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3.2rem;
`;

const StyledVideoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3.2rem 0;
`;

const StyledMainVideo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem 0;

  width: 100%;

  padding: 2.4rem 0;
  border-bottom: 1px solid var(--gray-2);

  & > iframe {
    width: 100%;
    aspect-ratio: 1 / 0.556;

    border-radius: ${BORDER_RADIUS.md};
  }
`;

const StyledDetailInfo = styled.section`
  display: flex;
  flex-direction: column;

  width: 58%;

  padding-top: 2.4rem;

  & > div:first-child {
    display: flex;
    justify-content: space-between;

    padding: 2.4rem 0;
    border-bottom: 1px solid var(--gray-2);
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 1.2rem 0;

    padding: 3.2rem 0;

    font-size: ${FONT_SIZE.md};
    border-bottom: 1px solid var(--gray-2);

    & > div {
      display: flex;
      align-items: center;
      gap: 0 1.2rem;

      & > button {
        display: flex;
        align-items: center;
        gap: 0 0.4rem;

        border: none;
        background: none;
      }
    }
  }

  & > div:first-child > div {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & > div {
      display: flex;
      align-items: center;
      gap: 0 0.8rem;

      font-size: ${FONT_SIZE.md};
    }

    & > div > button {
      display: flex;
      align-items: center;
      gap: 0 0.4rem;

      padding: 0;

      border: none;
      background: none;
    }
  }
`;

const StyledLinkContainer = styled.section`
  display: flex;
  flex-direction: column;

  position: sticky;
  top: 80px;

  width: 33%;
  height: 100%;

  & > button:last-child {
    display: flex;
    align-items: center;
    gap: 0 1.2rem;

    margin: 2rem auto 0;

    border: none;
    background: none;

    & > div {
      color: var(--gray-3);
      font-family: SUIT-Medium;
      font-size: 1.4rem;
      text-decoration-line: underline;
    }
  }
`;

const StyledMainLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  width: 100%;

  padding: 2.4rem;

  border: 1px solid var(--gray-2);
  border-radius: ${BORDER_RADIUS.md};

  margin-top: 4.8rem;
  box-shadow: var(--shadow);

  & > button {
    display: flex;
    align-items: center;
    gap: 0 4rem;

    padding: 1.6rem 3.2rem;

    border: none;
    border-radius: ${BORDER_RADIUS.md};

    font-family: SUIT-Medium;
    font-size: ${FONT_SIZE.md};

    & > div {
      color: var(--white);
    }

    &:first-child {
      background: #03c75a;
    }

    &:nth-child(2) {
      background: var(--red-2);
    }
  }
`;

const StyledNearByRestaurant = styled.section`
  display: flex;
  flex-direction: column;

  margin: 3.2rem 0;

  & > ul {
    ${hideScrollBar}
    display: flex;
    gap: 0 2rem;
    overflow-x: scroll;

    padding: 2rem 0;

    & > * {
      min-width: 300px;

      box-shadow: var(--shadow);
    }
  }
`;

const StyledMapSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem 0;
  margin-bottom: 4.8rem;

  & > div {
    border-radius: ${BORDER_RADIUS.md};
    overflow: hidden;
  }
`;
