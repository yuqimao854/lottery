import type { NextPage } from 'next';
import Head from 'next/head';
import { DSY } from '../components';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DSYPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.localStorage.getItem('password') !== 'dsy') {
      router.replace('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>dsy</title>
      </Head>
      <DSY />
    </div>
  );
};

export default DSYPage;
