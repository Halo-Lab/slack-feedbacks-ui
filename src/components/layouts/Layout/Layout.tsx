import Head from 'next/head';
import { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import CustomButton from 'src/components/atoms/Button/CustomButton';
import Link from 'next/link';
import classes from './Layout.module.scss';

type IProps = {
  children: ReactNode;
  title?: string;
};

const requireAuthRoutes = ['/', '/left-for-me-feedbacks', '/my-feedbacks'];

export default function Layout({ title = 'feedbacks', children }: IProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const handleSignout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signOut();
  };

  if (router.pathname === '/auth/signin' && session) {
    router.push('/');
    return (
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={true} size={150} />
      </div>
    );
  }

  if (requireAuthRoutes.includes(router.pathname) && !session && status !== 'loading') {
    router.push('/auth/signin');
    return (
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={true} size={150} />
      </div>
    );
  }

  if (
    (requireAuthRoutes.includes(router.pathname) && session) ||
    !requireAuthRoutes.includes(router.pathname)
  ) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <main className={classes.container}>
          {router.pathname !== '/auth/signin' && (
            <div className={classes.header}>
              <Link href="/">
                <a>
                  <Image
                    loading="eager"
                    src={'/team-garden.png'}
                    alt="User photo"
                    width={32}
                    height={32}
                  />
                </a>
              </Link>
              <CustomButton href="#" onClick={handleSignout} variant={'outlined'}>
                <span>Sign out</span>
              </CustomButton>
            </div>
          )}
          <div className={classes.wrapper}>{children}</div>
        </main>
      </>
    );
  }

  return null;
}
