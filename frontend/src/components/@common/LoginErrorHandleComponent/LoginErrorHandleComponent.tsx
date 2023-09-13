import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileData } from '~/@types/api.types';
import useUser from '~/hooks/server/useUser';

interface LoginErrorHandleComponentProps {
  children: React.ReactNode;
}

function LoginErrorHandleComponent({ children }: LoginErrorHandleComponentProps) {
  const navigator = useNavigate();
  const { getProfile } = useUser();

  const { isLoading, isFetching, isSuccess } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    retry: 1,
  });

  useEffect(() => {
    if (!isFetching && !isSuccess) {
      navigator('/signUp');
    }
  }, [isFetching, isSuccess]);

  if (isLoading) return null;

  return <main>{children}</main>;
}

export default LoginErrorHandleComponent;
