import React, { FC, useRef, useState } from 'react';
import { LuckyWheel } from '@lucky-canvas/react';

const TurnTable: FC = () => {
  const [target, setTarget] = useState('');

  const [blocks] = useState([
    { padding: '10px', background: '#e9e8fe' },
    { padding: '10px', background: '#869cfa' },
  ]);
  const [prizes] = useState([
    {
      background: '#e9e8fe',
      range: 25,
      fonts: [{ text: '炸鸡' }],
      imgs: [
        {
          src: 'https://img1.baidu.com/it/u=1537115176,1287674847&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427',
          height: '50px',
          width: '60px',
          top: '30px',
        },
      ],
    },
    {
      background: '#b8c5f2',
      range: 25,
      fonts: [{ text: '汉堡' }],
      imgs: [
        {
          src: 'https://img2.baidu.com/it/u=1170719478,4207668301&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
          height: '50px',
          width: '60px',
          top: '30px',
        },
      ],
    },
    {
      background: '#e9e8fe',
      range: 25,
      fonts: [{ text: '鸡肉卷' }],
      imgs: [
        {
          src: 'https://img1.baidu.com/it/u=2617048388,173066499&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
          height: '50px',
          width: '60px',
          top: '30px',
        },
      ],
    },
    {
      background: '#b8c5f2',
      range: 25,
      fonts: [{ text: '薯条' }],
      imgs: [
        {
          src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F022R1101525%2F21022Q01525-9-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658398577&t=7124e43f9018c247ecc7160a04004fa0',
          height: '50px',
          width: '60px',
          top: '30px',
        },
      ],
    },
  ]);
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%',
      background: '#869cfa',
      pointer: true,
      fonts: [{ text: '开始', top: '-10px' }],
    },
  ]);
  const myLucky = useRef();
  return (
    <div className=' w-full h-full'>
      <div className=' w-full text-center absolute top-1/2 left-1/2  -translate-x-1/2  -translate-y-1/2 '>
        <div className={` text-5xl text-center mb-10 ${target ? '' : ''} `}>
          {target ? (
            <div className='target'>今天我要吃{target}!!!</div>
          ) : (
            <div> 今天吃啥子</div>
          )}
        </div>
        <div className=' mx-auto w-[300px]'>
          <LuckyWheel
            ref={myLucky}
            width='300px'
            height='300px'
            blocks={blocks}
            prizes={prizes}
            buttons={buttons}
            onStart={() => {
              setTarget('');
              (myLucky.current as any).play();

              (myLucky.current as any).stop();
            }}
            onEnd={(prize: any) => {
              setTarget(prize.fonts[0].text);
            }}
            accelerationTime={1000}
            decelerationTime={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default TurnTable;
