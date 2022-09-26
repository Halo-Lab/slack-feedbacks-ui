import type { NextPage, GetServerSideProps } from 'next';
import Layout from 'src/components/layouts/Layout/Layout';
import WorkspaceUserScene from 'src/scenes/WorkspaceUserScene/WorkspaceUserScene';

type IProps = {
  user?: string;
  workspace?: string;
};

const WorkspaceUser: NextPage = ({ user, workspace }: IProps) => {
  return (
    <Layout>
      <WorkspaceUserScene user={user} workspace={workspace} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = context.params?.user;
  const workspace = context.params?.workspace;
  return {
    props: {
      user,
      workspace,
    },
  };
};

export default WorkspaceUser;
