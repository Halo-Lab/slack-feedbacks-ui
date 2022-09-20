import Head from 'next/head';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import CustomButton from 'src/components/atoms/Button/CustomButton';
import classes from './Layout.module.scss';

type IProps = {
  children: ReactNode;
  title?: string;
};

const requireAuthRoutes = ['/', '/test'];

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
      <div className={classes.container}>
        <ClipLoader color={'gray'} loading={true} size={150} />
      </div>
    );
  }

  if (requireAuthRoutes.includes(router.pathname) && !session && status !== 'loading') {
    router.push('/auth/signin');
    return (
      <div className={classes.container}>
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
          <div className={classes.wrapper}>
            {router.pathname !== '/auth/signin' && (
              <CustomButton href="#" onClick={handleSignout}>
                <p>Sign out</p>
              </CustomButton>
            )}
            {children}
          </div>
        </main>
      </>
    );
  }

  return null;
}
