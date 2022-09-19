import { ReactNode } from 'react';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import classes from './Layout.module.scss';

type LayoutType = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ title = 'feedbacks', children }: LayoutType) {
  const { data: session, status } = useSession();
  const handleSignin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signIn();
  };
  const handleSignout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signOut();
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <>
        {status !== 'loading' && (
          <main className={classes.container}>
            {session ? (
              <div className={classes.wrapper}>
                <div>
                  <a href="#" onClick={handleSignout} className="btn-signin">
                    Sign out
                  </a>
                </div>
                {children}
              </div>
            ) : (
              <a href="#" onClick={handleSignin} className="btn-signin">
                Sign in
              </a>
            )}
          </main>
        )}
      </>
    </>
  );
}
