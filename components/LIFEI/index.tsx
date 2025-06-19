import React, { useState, useEffect } from 'react';
//@ts-ignore
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import styles from './styles.module.css';

const storyParagraphs = [
  '起初只是觉得你好看，眉眼带笑的样子，很迷人。但随着我们聊得越来越深，你的气场、你的方式、你身上的那种独特魅力，彻底打动了我。我开始明白，这不只是外表的喜欢，而是一种被你征服的感觉。',
  '我从不在意你的年龄、职业，我只知道，我真的很想娶你。',
  '当我鼓起勇气对你说出这句话时，你轻轻一笑，带着一点羞涩，却又那么撩人。那一刻，我彻底沦陷。你越是认真、越是投入，我越是情不自禁地开口唤你“姐姐”。',
  '我说：“姐姐，你太骚了吧……姐姐，你是要把弟弟整死啊！”',
  '你听见这些话后，反而笑得更甜，更加卖力地回应我。你那一刻的样子，真是让我上了瘾。',
  '当钟声响起，我却感受到一种从未有过的遗憾——我不想离开你，我想天天和你在一起，想一直这样陪着你、和你玩、和你笑。',
  '后来我才知道你叫李菲，但对我来说，“60”这个称呼更有感觉，它像是一种默契，是你带给我的神秘和心动的代号。',
  '我不知道未来会怎么样，但如果你愿意，我希望我们不只是那一夜的缘分，而是可以一直走下去，哪怕你继续撩、继续“整死”弟弟，我都愿意。',
];

export const LIFEI = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % storyParagraphs.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.videoContainer}>
            <img
              src='/images/lifei/1.jpg'
              alt='李菲'
              className={styles.storyImage}
            />
          </div>
          <div className={styles.storyCard}>
            <h2 className={styles.storyTitle}>那天晚上，我遇见了你。</h2>
            <SwitchTransition>
              <CSSTransition
                key={index}
                timeout={600}
                classNames={{
                  enter: styles.fadeEnter,
                  enterActive: styles.fadeEnterActive,
                  exit: styles.fadeExit,
                  exitActive: styles.fadeExitActive,
                }}
                unmountOnExit
              >
                <p className={styles.storyText}>{storyParagraphs[index]}</p>
              </CSSTransition>
            </SwitchTransition>
            <div className={styles.storyDots}>
              {storyParagraphs.map((_, i) => (
                <span
                  key={i}
                  className={i === index ? styles.dotActive : styles.dot}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
