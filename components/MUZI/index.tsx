import React from 'react';
import styles from './styles.module.css';

export const Muzi = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>木子</h1>
        <div className={styles.videoContainer}>
          {/* 视频将在这里添加 */}
          <video className={styles.video} controls poster='/images/muzi/1.jpg'>
            <source src='/videos/muzi/1.mp4' type='video/mp4' />
            您的浏览器不支持视频播放。
          </video>
        </div>

        <div className={styles.description}>
          <h2 className={styles.subtitle}>温柔坚强 · 独立前行</h2>
          <p className={styles.text}>
            木子，一个让人心疼又敬佩的女孩。她的眼神中藏着故事，却依然闪烁着希望的光芒。
            生活的重担没有压垮她，反而让她更加坚强。
            她用温柔的手，抚平他人的疲惫；用温暖的心，治愈他人的伤痛。
            每一次的温柔触摸，都是对身心的深情问候，让疲惫的灵魂找到归宿。
          </p>
          <p className={styles.text}>
            在她的世界里，精油散发着治愈的魔力，唤醒沉睡的活力。
            温暖的石头在肌肤上滑动，带来更深层次的放松与舒适。
            她用自己的方式，为每一个疲惫的灵魂打造完美的放松之旅。
            她的温柔不是软弱，而是最强大的力量。
          </p>
          <p className={styles.text}>
            她的存在，就像一束温暖的光，照亮了黑暗中的路。
            她的努力和坚持，让我深深为之动容。
            在她最好的年纪，她依然保持着最纯真的笑容，
            用最温柔的方式，治愈着这个世界。 她值得被温柔以待，值得被用心呵护，
            因为她不仅是一个美丽的女孩，更是一个值得珍惜的人。
          </p>
        </div>
      </div>
    </div>
  );
};
