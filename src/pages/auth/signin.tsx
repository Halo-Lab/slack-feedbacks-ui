import { GetServerSideProps } from 'next';
import { getProviders } from 'next-auth/react';
import Layout from 'src/components/layouts/Layout/Layout';
import SignInScene from 'src/scenes/SignInScene/SignInScene';

export type IProvider = {
  name: string;
  id: string;
};

type IProps = {
  providers: IProvider[];
};

export default function SignIn({ providers }: IProps) {
  return (
    <Layout title="sign in">
      <SignInScene providers={providers} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
