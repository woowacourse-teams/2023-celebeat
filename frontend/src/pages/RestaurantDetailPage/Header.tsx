/* eslint-disable no-useless-return */
import styled from 'styled-components';
import View from '~/assets/icons/view.svg';
import Love from '~/assets/icons/black-love.svg';
import { FONT_SIZE } from '~/styles/common';
import ShareIcon from '~/assets/icons/share.svg';
import ShareButton from '~/components/@common/ShareButton';
import { LinkProps } from '~/@types/meta.types';

interface HeaderProps {
  name: string;
  viewCount: number;
  likeCount: number;
  meta: LinkProps;
}

function Header({ name, viewCount, likeCount, meta }: HeaderProps) {
  const share = async () => {
    if (typeof navigator.share === 'undefined') {
      await copyClipBoard(window.location.href);
      return;
    }
    try {
      await navigator.share({ url: window.location.href });
    } catch (e) {
      if (e.toString().includes('AbortError')) return;
    }
  };

  const copyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('링크가 복사되었어요.');
    } catch (err) {
      alert('클립보드에 저장하는데 문제가 생겼어요.');
    }
  };

  return (
    <StyledDetailHeader tabIndex={0}>
      <StyledTitleSection>
        <h3>{name}</h3>
        <div>
          <StyledShareButton type="button" onClick={share}>
            <ShareIcon />
          </StyledShareButton>
          <ShareButton type="kakao" meta={meta}>
            <img
              width={28}
              height={28}
              src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
              alt="카카오톡 공유 보내기 버튼"
            />
          </ShareButton>
        </div>
      </StyledTitleSection>
      <div role="group">
        <div aria-label={`조회수 ${viewCount}`}>
          <View width={18} aria-hidden /> <span aria-hidden>{viewCount}</span>
        </div>
        <div aria-label={`좋아요수 ${viewCount}`}>
          <Love width={18} aria-hidden /> <span aria-hidden>{likeCount}</span>
        </div>
      </div>
    </StyledDetailHeader>
  );
}

export default Header;

const StyledDetailHeader = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.8rem 0;

  padding: 1.2rem 0 2.4rem;

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

const StyledShareButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledTitleSection = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
`;
