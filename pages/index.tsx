import type { NextPage } from 'next';
import Head from 'next/head';
import { TurnTable, Weekend, ELSBlock } from '../components';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>block</title>
      </Head>
      {/* <TurnTable /> */}
      {/* <Weekend /> */}
      <ELSBlock />
    </div>
  );
};

export default Home;
