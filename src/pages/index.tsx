import type { NextPage } from 'next';
import HomeScene from 'src/scenes/HomeScene/HomeScene';
import Layout from '../components/layouts/Layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout title="feedbacks">
      <HomeScene />
    </Layout>
  );
};

export default Home;
