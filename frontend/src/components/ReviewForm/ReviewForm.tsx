import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import imageCompression from 'browser-image-compression';
import useRestaurantReview from '~/hooks/server/useRestaurantReview';

import { FONT_SIZE } from '~/styles/common';

import StarRating from '~/components/@common/StarRating/StarRating';
import ReviewImageForm from '~/components/ReviewImageForm';
import TextButton from '~/components/@common/Button';

import { changeImgFileExtension } from '~/utils/image';

import type { ReviewSubmitButtonType } from '~/@types/review.types';
import type { StarRate } from '~/@types/api.types';
import Spinner from '~/components/@common/Spinner';

interface ReviewFormProps {
  type: ReviewSubmitButtonType;
  reviewId?: number;
}

interface BlobType extends Blob {
  name?: string;
}

export const SUBMIT_BUTTON_TEXT = {
  create: '등록하기',
  update: '수정하기',
} as const;

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 350,
  useWebWorker: true,
};

function ReviewForm({ type, reviewId }: ReviewFormProps) {
  const { id: restaurantId } = useParams();
  const { restaurantReviewsData, createReview, updateReview, isSubmitRequesting } = useRestaurantReview();

  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [rating, setRating] = useState<StarRate>(0);
  const [files, setFiles] = useState<BlobType[]>([]);

  const isSubmitDisabled = text.length === 0 || rating === 0 || isSubmitRequesting;

  useEffect(() => {
    if (type === 'update') {
      const targetReview = restaurantReviewsData?.reviews.find(review => review.id === reviewId);

      setRating(targetReview.rating);
      setText(targetReview.content);
    }
  }, [restaurantReviewsData, images, files]);

  const onUploadReviewImage: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const imageFile = e.target.files[0];

    const blob = new Blob([imageFile], { type: 'image/webp' });
    const webpFile = new File([blob], changeImgFileExtension(imageFile.name), { type: 'image/webp' });

    try {
      const compressedFile = await imageCompression(webpFile, options);
      const compressedImageUrl = URL.createObjectURL(compressedFile);

      setImages([...images, compressedImageUrl]);
      setFiles([...files, compressedFile]);
    } catch (error) {
      setImages([]);
    }
  };

  const deleteReviewImage = (reviewImageId: number) => {
    setFiles(prev => prev.filter((_, id) => id !== reviewImageId));
    setImages(prev => prev.filter((_, id) => id !== reviewImageId));
  };

  const onClickStarRate: React.MouseEventHandler<HTMLButtonElement> = e => {
    const clickedStarRate = Number(e.currentTarget.dataset.rate) as StarRate;

    setRating(clickedStarRate);
  };

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    setText(e.target.value);
  };

  const makeReviewFormData = () => {
    const formData = new FormData();

    formData.append('content', text);
    formData.append('rating', String(rating));

    return formData;
  };

  const submitReviewForm: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();

    const formData = makeReviewFormData();

    switch (type) {
      case 'create':
        files.forEach(file => {
          formData.append('images', file, file.name);
        });
        formData.append('restaurantId', restaurantId);

        createReview(formData);
        break;
      case 'update':
        updateReview({ reviewId, body: { content: text, rating } });
        break;
      default:
        throw new Error('해당 타입의 review Form은 지원하지 않습니다.');
    }
  };

  return (
    <StyledReviewFormContainer>
      <StyledReviewFormItemText>별점 등록하기 ({rating}/5)</StyledReviewFormItemText>
      <StarRating rate={rating} onRateClick={onClickStarRate} />

      <StyledReviewFormItemText>후기 작성하기</StyledReviewFormItemText>
      <StyledTextArea placeholder="음식점을 다녀간 후기를 들려주세요" value={text} onChange={onChange} />
      {type !== 'update' && (
        <>
          <StyledReviewFormItemText>
            사진 등록하기
            <StyledImageDescription>(최대 3장)</StyledImageDescription>
          </StyledReviewFormItemText>
          <ReviewImageForm images={images} upload={onUploadReviewImage} deleteImage={deleteReviewImage} />
        </>
      )}

      {isSubmitRequesting ? (
        <StyledSpinnerWrapper>
          <Spinner size="20px" />
        </StyledSpinnerWrapper>
      ) : (
        <TextButton
          type="submit"
          onClick={submitReviewForm}
          text={SUBMIT_BUTTON_TEXT[type]}
          colorType="dark"
          disabled={isSubmitDisabled}
        />
      )}
    </StyledReviewFormContainer>
  );
}

export default ReviewForm;

const StyledImageDescription = styled.span`
  font-size: ${FONT_SIZE.md};
  font-weight: 500;
`;

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

const StyledSpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  padding: 1.2rem 2.4rem;

  background-color: var(--primary-3);
`;
