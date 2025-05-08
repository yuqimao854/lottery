'use client';
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';

const images = [
  '/images/dsy/1.jpg',
  '/images/dsy/2.jpg',
  '/images/dsy/3.jpg',
  '/images/dsy/4.jpg',
  '/images/dsy/5.jpg',
  '/images/dsy/6.jpg',
  '/images/dsy/7.jpg',
  '/images/dsy/8.jpg',
  '/images/dsy/4.jpg',
  '/images/dsy/5.jpg',
  '/images/dsy/6.jpg',
];

export const DSYPC = () => {
  const radius = 500;
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const imageCount = images.length;

  const imageNodes = images.map((src, index) => {
    const phi = Math.acos(-1 + (2 * index) / imageCount);
    const theta = Math.sqrt(imageCount * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    const style = {
      backgroundImage: `url(${src})`,
      '--x': `${x}px`,
      '--y': `${y}px`,
      '--z': `${z}px`,
    } as React.CSSProperties;

    return (
      <div
        key={index}
        className={styles.image}
        style={style}
        onClick={() => {
          setActiveImageIndex(index);
          setShowOverlay(true);
        }}
      />
    );
  });
  const [isExiting, setIsExiting] = useState(false);
  const closeImage = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveImageIndex(null);
      setShowOverlay(false);
      setIsExiting(false);
    }, 300); // 与 CSS 动画时间一致
  };

  // 星星坠落背景
  useEffect(() => {
    const container = document.querySelector(`.${styles['starry-bg']}`);
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = styles.star;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.animationDuration = `${1 + Math.random() * 2}s`;
      container.appendChild(star);
      setTimeout(() => {
        star.remove();
      }, 3000);
    };

    const interval = setInterval(createStar, 150);
    return () => clearInterval(interval);
  }, []);

  // 恒星闪烁背景
  useEffect(() => {
    const sky = document.querySelector(`.${styles['starry-sky']}`);
    if (!sky) return;

    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = styles.twinkle;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
      sky.appendChild(star);
    }
  }, []);

  return (
    <div className={styles.scene}>
      {/* 背景遮罩 */}
      {showOverlay && (
        <div className={`${styles.overlay}`} onClick={closeImage} />
      )}

      {/* 顶层展示 active 图片 */}
      {activeImageIndex !== null && (
        <div
          className={`${styles.activeImage} ${isExiting ? styles.exit : ''}`}
          style={{ backgroundImage: `url(${images[activeImageIndex]})` }}
          onClick={closeImage}
        />
      )}

      {/* 音乐播放 */}
      <audio autoPlay loop>
        <source src='/audios/dsy.m4a' type='audio/mp4' />
        Your browser does not support the audio element.
      </audio>

      <div className={styles['starry-sky']} />
      <div className={styles['starry-bg']} />
      <div className={styles.galaxy} />
      <div className={styles.sphere}>
        <div className={styles.innerSphere}>{imageNodes}</div>
      </div>
    </div>
  );
};
