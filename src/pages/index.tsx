import type { NextPage } from 'next';
import Layout from '../components/layouts/Layout/Layout';
import HomeScene from '../scenes/Home/HomeScene';

const Home: NextPage = () => {
  return (
    <Layout title="feedbacks">
      <HomeScene />
    </Layout>
  );
};

export default Home;
