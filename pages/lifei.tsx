import type { NextPage } from 'next';
import Head from 'next/head';
import { LIFEI } from '../components';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LifeiPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.localStorage.getItem('password') !== 'lifei') {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Lifei</title>
      </Head>

      <LIFEI />
    </div>
  );
};

export default LifeiPage;
