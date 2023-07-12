import { ComponentPropsWithRef, forwardRef } from 'react';
import styled from 'styled-components';
import type { Option } from '~/@types/celebs.types';
import ProfileImage from '~/components/@common/ProfileImage';
import { BORDER_RADIUS, FONT_SIZE } from '~/styles/common';

interface SearchbarSelectBoxProps extends ComponentPropsWithRef<'ul'> {
  width: number;
  options: Option[];
  onClickEvent: (option: Option) => () => void;
}

const SearchbarSelectBox = forwardRef<HTMLUListElement, SearchbarSelectBoxProps>(
  ({ options, width, onClickEvent }, ref) => (
    <StyledSearchbarTags width={width} ref={ref}>
      {options.map(option => (
        <StyledSearchBarTag key={option.id} value={option.youtubeChannelName} onClick={onClickEvent(option)}>
          <ProfileImage name={option.name} imageUrl={option.profileImageUrl} size={36} />
          <StyledYoutuberName>{option.youtubeChannelName}</StyledYoutuberName>
        </StyledSearchBarTag>
      ))}
    </StyledSearchbarTags>
  ),
);

export default SearchbarSelectBox;

const StyledSearchbarTags = styled.ul<{ width: number }>`
  border-radius: ${BORDER_RADIUS.lg};

  width: ${props => `${props.width}px`}

  padding: 0 2.1rem;

  font-size: ${FONT_SIZE.sm};

  box-shadow: var(--shadow);
`;

const StyledSearchBarTag = styled.li`
  display: flex;
  align-items: center;

  padding: 1.1rem;

  border: none;
  background: none;
  outline: none;

  & + & {
    border-top: 1px solid var(--gray-1);
  }
`;

const StyledYoutuberName = styled.span`
  margin-left: 1.9rem;
`;
