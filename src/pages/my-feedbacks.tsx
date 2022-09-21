import type { NextPage } from 'next';
import MyFeedbacksScene from 'src/scenes/MyFeedbacksScene/MyFeedbacksScene';
import Layout from '../components/layouts/Layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout title="My Feedbacks">
      <MyFeedbacksScene />
    </Layout>
  );
};

export default Home;
