import type { NextPage } from 'next';
import Head from 'next/head';
import { DSY, DSYIntroAnimation } from '../components';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const DSYPage: NextPage = () => {
  const router = useRouter();
  const [showDSY, setShowDSY] = useState(false); // 控制DSY组件的显示

  useEffect(() => {
    if (window.localStorage.getItem('password') !== 'dsy') {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>dsy</title>
      </Head>

      {/* 显示DSYIntroAnimation组件 */}
      {!showDSY && (
        <DSYIntroAnimation
          onComplete={() => setShowDSY(true)} // 动画完成后显示DSY
        />
      )}

      {/* 当showDSY为true时，显示DSY组件 */}
      {showDSY && <DSY />}
    </div>
  );
};

export default DSYPage;
