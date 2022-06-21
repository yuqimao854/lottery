import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { TurnTable } from '../components';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>抽奖</title>
      </Head>
      <TurnTable />
    </div>
  );
};

export default Home;
