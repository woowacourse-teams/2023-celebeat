import styled from 'styled-components';
import { MouseEvent, useState } from 'react';

import CelebIcon from '~/assets/icons/celeb.svg';
import SearchIcon from '~/assets/icons/search.svg';
import { isEqual } from '~/utils/compare';
import ProfileImage from '~/components/@common/ProfileImage';
import NavItem from '~/components/@common/NavButton/NavButton';
import useBooleanState from '~/hooks/useBooleanState';

import type { Celeb } from '~/@types/celeb.types';

interface DropDownProps {
  celebs: Celeb[];
  isOpen?: boolean;
  externalOnClick?: (e?: MouseEvent<HTMLLIElement>) => void;
}

function CelebDropDown({ celebs, externalOnClick, isOpen = false }: DropDownProps) {
  const [selected, setSelected] = useState<Celeb['name']>('전체');
  const { value: isShow, toggle: onToggleDropDown, setFalse: onCloseDropDown } = useBooleanState(isOpen);

  const onSelection = (celeb: Celeb['name']) => (event?: MouseEvent<HTMLLIElement>) => {
    setSelected(celeb);

    if (externalOnClick) externalOnClick(event);
  };

  return (
    <StyledCelebDropDown>
      <StyledNavItemWrapper onClick={onToggleDropDown} onBlur={onCloseDropDown}>
        <NavItem label="셀럽" icon={<CelebIcon />} isShow={isShow} />
      </StyledNavItemWrapper>

      {isShow && (
        <StyledDropDownWrapper>
          <StyledSelectContainer>
            {celebs.map(({ id, name, profileImageUrl }) => (
              <StyledDropDownOption data-id={id} onMouseDown={onSelection(name)}>
                <div>
                  <ProfileImage name={name} imageUrl={profileImageUrl} size="20px" />
                  {name}
                </div>
                {isEqual(selected, name) && <SearchIcon />}
              </StyledDropDownOption>
            ))}
          </StyledSelectContainer>
        </StyledDropDownWrapper>
      )}
    </StyledCelebDropDown>
  );
}

export default CelebDropDown;

const StyledNavItemWrapper = styled.button`
  border: none;
  background: transparent;

  cursor: pointer;
  outline: none;
`;

const StyledCelebDropDown = styled.div`
  position: relative;
`;

const StyledDropDownWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-content: center;

  position: absolute;
  top: calc(100% + 16px);
  left: 18px;

  width: 216px;
  height: 176px;

  padding: 1.8rem 0;

  border-radius: 10px;
  background: white;

  box-shadow: var(--shadow);
`;

const StyledSelectContainer = styled.div`
  width: 100%;
  height: 150px;

  background: transparent;

  overflow-y: auto;
`;

const StyledDropDownOption = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 44px;

  margin: 0 1.8rem;

  cursor: pointer;

  & + & {
    border-bottom: 1px solid var(--gray-1);
  }

  &:first-child {
    border-bottom: 1px solid var(--gray-1);
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;
