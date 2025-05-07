import type { NextPage } from 'next';
import Head from 'next/head';
import { ELSBlock } from '../components';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const BlockPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.localStorage.getItem('password') !== 'block') {
      router.replace('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>俄罗斯方块</title>
      </Head>
      <ELSBlock />
    </div>
  );
};

export default BlockPage;
