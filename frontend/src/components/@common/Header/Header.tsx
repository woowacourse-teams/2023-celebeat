import { styled } from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wrapper } from '@googlemaps/react-wrapper';
import { useQueryClient } from '@tanstack/react-query';

import InfoDropDown from '~/components/InfoDropDown';
import LoginModal from '~/components/LoginModal';
import SearchBar from '~/components/SearchBar';

import useBooleanState from '~/hooks/useBooleanState';

import Logo from '~/assets/icons/logo.svg';

import type { ProfileData } from '~/@types/api.types';
import { getLogout } from '~/api/user';

function Header() {
  const qc = useQueryClient();
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const { value: isModalOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);

  const handleInfoDropDown = (event: React.MouseEvent<HTMLElement>) => {
    const currentOption = event.currentTarget.dataset.name;
    const profileData: ProfileData = qc.getQueryData(['profile']);
    if (currentOption === '로그인') openModal();
    if (currentOption === '위시리스트') navigator('/restaurants/like');
    if (currentOption === '회원 탈퇴') navigator('/withdrawal');
    if (currentOption === '로그아웃') {
      getLogout(profileData.oauthServer);
      window.location.reload();
    }
  };

  const isHome = pathname === '/';

  return (
    <>
      <StyledHeader>
        <Link aria-label="셀럽잇 홈페이지" role="button" to="/">
          <Logo width={136} />
        </Link>
        {isHome && (
          <Wrapper apiKey={process.env.GOOGLE_MAP_API_KEY} language="ko" libraries={['places']}>
            <SearchBar />
          </Wrapper>
        )}

        <InfoDropDown externalOnClick={handleInfoDropDown} isOpen={isModalOpen} label="로그인" />
      </StyledHeader>

      <LoginModal close={closeModal} isOpen={isModalOpen} />
    </>
  );
}

export default Header;

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: sticky;
  top: 0;
  z-index: 20;

  width: 100%;
  height: 80px;

  padding: 1.2rem 2.4rem;

  background-color: var(--white);
  border-bottom: 1px solid var(--gray-1);
`;
