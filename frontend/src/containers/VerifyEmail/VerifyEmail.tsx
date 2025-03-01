'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

import { APP_ROUTES } from '@/constants';
import { fetchData } from '@/utils';

import type { PageProps } from '@/types/common';

const VerifyEmail = ({
  searchParams: { token },
}: PageProps<never, { token: string }>) => {
  const interval = useRef<ReturnType<typeof setTimeout>>();

  const router = useRouter();
  const [count, setCount] = useState(8);
  const hasCalledAPI = useRef(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );

  const verifyEmail = useCallback(async () => {
    const res = await fetchData(
      `/email-verify?token=${token}`,
      {
        method: 'GET',
      },
      false,
    );

    if (res.statusCode === 200) {
      setStatus('success');
      interval.current = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            router.replace(APP_ROUTES.login);
            clearInterval(interval.current);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } else {
      enqueueSnackbar(res?.error?.message, { variant: 'error' });
      setStatus('error');
    }
  }, [token, router]);

  useEffect(() => {
    if (token && !hasCalledAPI.current) {
      hasCalledAPI.current = true;
      verifyEmail();
    } else if (!token) {
      setStatus('error');
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [token, verifyEmail]);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        bounce: 0.5,
        visualDuration: 0.75,
      }}
      className='flex h-screen w-screen flex-col items-center justify-center text-center'
    >
      {status === 'loading' && (
        <p className='font-semibold'>Verifying your email...</p>
      )}
      <div className='flex flex-col items-center gap-4'>
        {status === 'success' && (
          <>
            <DotLottieReact
              src='email-verify-success.lottie'
              autoplay
              height={80}
            />
            <h2 className='text-3xl font-semibold'>Email Verification</h2>
            <p className='font-semibold'>
              Your email has been verified. Redirecting to login in {count}
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <DotLottieReact
              src='email-verify-fail.lottie'
              autoplay
              height={80}
            />
            <p className='font-semibold text-red-500'>
              Email verification failed. Please try again.
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
