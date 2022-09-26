import type { NextPage, GetServerSideProps } from 'next';
import Layout from 'src/components/layouts/Layout/Layout';
import UserScene from 'src/scenes/UserScene/UserScene';

type IProps = {
  user?: string;
};

const User: NextPage = ({ user }: IProps) => {
  return (
    <Layout>
      <UserScene user={user} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = context.params?.user;
  return {
    props: { user },
  };
};

export default User;
