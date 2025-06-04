import type { NextPage } from 'next';
import Head from 'next/head';
import { Muzi } from '../components';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const MuziPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.localStorage.getItem('password') !== 'muzi') {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>muzi</title>
      </Head>

      <Muzi />
    </div>
  );
};

export default MuziPage;
