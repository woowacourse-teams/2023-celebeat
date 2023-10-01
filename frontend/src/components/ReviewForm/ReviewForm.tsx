import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import useRestaurantReview from '~/hooks/server/useRestaurantReview';

import { FONT_SIZE } from '~/styles/common';

import StarRating from '~/components/@common/StarRating/StarRating';
import ReviewImageForm from '~/components/ReviewImageForm';
import TextButton from '~/components/@common/Button';

import type { StarRate } from '~/components/@common/StarRating/StarRating';
import type { ReviewSubmitButtonType } from '~/@types/review.types';

const SUBMIT_BUTTON_TEXT = {
  create: '등록하기',
  update: '수정하기',
  report: '신고하기',
} as const;

interface ReviewFormProps {
  type: ReviewSubmitButtonType;
  reviewId?: number;
}

function ReviewForm({ type, reviewId }: ReviewFormProps) {
  const { id: restaurantId } = useParams();

  const { restaurantReviewsData, createReview, updateReview, postReviewReport } = useRestaurantReview();

  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [rate, setRate] = useState<StarRate>(0);

  const isSubmitDisabled = text.length === 0 || rate === 0;

  useEffect(() => {
    if (type === 'update') {
      const targetReview = restaurantReviewsData?.reviews.find(review => review.id === reviewId);
      setText(targetReview.content);
      setImages(targetReview.reviewImageUrls);
    }
  }, [restaurantReviewsData]);

  const onUploadReviewImage: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
      };

      reader.readAsDataURL(file);
    } else {
      setImages(null);
    }
  };

  const deleteReviewImage = (reviewImageId: number) => {
    setImages(images.filter((_, id) => id !== reviewImageId));
  };

  const onClickStarRate: React.MouseEventHandler<HTMLButtonElement> = e => {
    const clickedStarRate = Number(e.currentTarget.dataset.rate) as StarRate;

    setRate(clickedStarRate);
  };

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    setText(e.target.value);
  };

  const makeReviewFormData = () => {
    const formData = new FormData();

    formData.append('images', JSON.stringify(images));
    formData.append('content', text);
    formData.append('rate', String(rate));

    return formData;
  };

  const submitReviewForm: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();

    const formData = makeReviewFormData();

    switch (type) {
      case 'create':
        formData.append('restaurantId', restaurantId);
        createReview(formData);
        break;
      case 'update':
        updateReview({ reviewId, body: formData });
        break;
      case 'report':
        postReviewReport({ reviewId, content: text });
        break;
      default:
        throw new Error('해당 타입의 review Form은 지원하지 않습니다.');
    }
  };

  return (
    <StyledReviewFormContainer>
      <StyledReviewFormItemText>별점 등록하기 ({rate}/5)</StyledReviewFormItemText>
      <StarRating rate={rate} onRateClick={onClickStarRate} />

      <StyledReviewFormItemText>후기 작성하기</StyledReviewFormItemText>
      <StyledTextArea
        placeholder={type === 'report' ? '신고 사유를 작성해주세요' : '음식점을 다녀간 후기를 들려주세요'}
        value={text}
        onChange={onChange}
      />

      <StyledReviewFormItemText>사진 등록하기</StyledReviewFormItemText>
      <ReviewImageForm images={images} upload={onUploadReviewImage} deleteImage={deleteReviewImage} />

      <TextButton
        type="submit"
        onClick={submitReviewForm}
        text={SUBMIT_BUTTON_TEXT[type]}
        colorType="dark"
        disabled={isSubmitDisabled}
      />
    </StyledReviewFormContainer>
  );
}

export default ReviewForm;

const StyledReviewFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem 0;

  width: 100%;
`;

const StyledTextArea = styled.textarea`
  height: 300px;

  padding: 0.8rem;

  border: 5px solid var(--gray-2);
  border-radius: 10px;
  background-color: var(--gray-2);

  font-size: ${FONT_SIZE.md};
  text-align: start;
  resize: vertical;

  &:focus {
    border: 5px solid #ff7b54;
  }
`;

const StyledReviewFormItemText = styled.span`
  font-size: ${FONT_SIZE.lg};
  font-weight: bold;
`;
