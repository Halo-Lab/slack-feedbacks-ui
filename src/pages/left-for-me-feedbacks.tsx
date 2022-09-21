import type { NextPage } from 'next';
import LeftForMeFeedbacksScene from 'src/scenes/LeftForMeFeedbacksScene/LeftForMeFeedbacksScene';
import Layout from '../components/layouts/Layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout title="Feedbacks left for me">
      <LeftForMeFeedbacksScene />
    </Layout>
  );
};

export default Home;
