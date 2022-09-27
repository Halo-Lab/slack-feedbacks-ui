import type { NextPage, GetServerSideProps } from 'next';
import Layout from 'src/components/layouts/Layout/Layout';
import TeamScene from 'src/scenes/TeamScene/TeamScene';

type IProps = {
  id?: string;
};

const Team: NextPage = ({ id }: IProps) => {
  return (
    <Layout>
      <TeamScene id={id} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  return {
    props: { id },
  };
};

export default Team;
