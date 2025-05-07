'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TEXT = '2025年纪念';
const images = ['/images/dsy/1.jpg', '/images/dsy/4.jpg', '/images/dsy/8.jpg'];

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 300 },
  }),
};

const countdownVariants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -45 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 2, rotate: 90 },
};

const imageAnimations = [
  {
    initial: { scale: 0.5, y: 50, rotate: -15, opacity: 0 },
    animate: {
      scale: 1,
      y: [50, -10, 0],
      rotate: [0, 10, 0],
      opacity: 1,
      transition: { duration: 1 },
    },
    exit: { opacity: 0, scale: 0.8, rotate: 20 },
  },
  {
    initial: { x: -100, opacity: 0, rotateY: 90 },
    animate: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 1 },
    },
    exit: { x: 100, opacity: 0 },
  },
  {
    initial: { scale: 1.2, opacity: 0.5 },
    animate: {
      scale: [1.2, 0.9, 1],
      opacity: 1,
      transition: { duration: 1 },
    },
    exit: { scale: 0.5, opacity: 0 },
  },
];

export const DSYIntroAnimation = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [step, setStep] = useState<'text' | 'countdown' | 'done'>('text');
  const [count, setCount] = useState(3);
  const [imgIndex, setImgIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false); // 控制完成后的动画状态

  useEffect(() => {
    if (step === 'text') {
      setTimeout(() => setStep('countdown'), 2000);
    } else if (step === 'countdown') {
      const timer = setInterval(() => {
        setImgIndex((i) => (i + 1) % images.length);
        setCount((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setStep('done');
            setFadeOut(true); // 开始触发完成时的动画
            onComplete?.();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, onComplete]);

  return (
    <div className='fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white'>
      <AnimatePresence mode='wait'>
        {step === 'text' && (
          <motion.div
            key='text'
            className='text-5xl font-bold flex gap-2'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {TEXT.split('').map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial='hidden'
                animate='visible'
                className='drop-shadow-lg'
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}

        {step === 'countdown' && (
          <motion.div
            key={`count-${count}`}
            className='text-7xl font-extrabold mb-6 tracking-wider text-pink-200'
            variants={countdownVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {step === 'countdown' && (
          <motion.div
            key={imgIndex}
            variants={imageAnimations[imgIndex % imageAnimations.length]}
            initial='initial'
            animate='animate'
            exit='exit'
            className='w-64 h-96 overflow-hidden rounded-2xl shadow-lg'
          >
            <img
              src={images[imgIndex]}
              alt={`img-${imgIndex}`}
              width={256}
              height={384}
              className='object-cover w-full h-full'
            />
          </motion.div>
        )}

        {step === 'done' && fadeOut && (
          <motion.div
            key='done'
            className='absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white'
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onAnimationComplete={onComplete}
          >
            动画完成
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
