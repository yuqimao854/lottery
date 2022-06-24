import React, { FC, useEffect, useRef, useState } from 'react';
import { LuckyWheel } from '@lucky-canvas/react';
import Tab from './Tab';

const TurnTable: FC = () => {
  const [target, setTarget] = useState('');

  const [blocks] = useState([
    { padding: '10px', background: '#e9e8fe' },
    { padding: '10px', background: '#869cfa' },
  ]);

  const allFood = {
    快餐: [
      {
        text: '炒饭',
        img: 'https://img2.baidu.com/it/u=1101523207,651871526&fm=253&fmt=auto&app=138&f=JPEG?w=497&h=294',
      },
      {
        text: '炒面',
        img: 'https://img0.baidu.com/it/u=2609875662,1070264121&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
      },
      {
        text: '炒河粉',
        img: 'https://img1.baidu.com/it/u=411924035,2701001621&fm=253&fmt=auto&app=138&f=JPG?w=669&h=500',
      },
      {
        text: '盖浇饭',
        img: 'https://img1.baidu.com/it/u=2816415124,413253130&fm=253&fmt=auto&app=138&f=JPEG?w=735&h=500',
      },
    ],
    面食: [
      {
        text: '抄手',
        img: 'https://img0.baidu.com/it/u=4043025353,2782716039&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=373',
      },
      {
        text: '面条',
        img: 'https://img1.baidu.com/it/u=2064885703,711916222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
      },
      {
        text: '饺子',
        img: 'https://img1.baidu.com/it/u=3564330157,3096608151&fm=253&fmt=auto&app=138&f=JPEG?w=748&h=500',
      },
      {
        text: '螺蛳粉',
        img: 'https://img0.baidu.com/it/u=2365144078,1664837876&fm=253&fmt=auto&app=138&f=JPEG?w=540&h=360',
      },
    ],
    洋快餐: [
      {
        text: '炸鸡',
        img: 'https://img1.baidu.com/it/u=1537115176,1287674847&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427',
      },
      {
        text: '汉堡',
        img: 'https://img2.baidu.com/it/u=1170719478,4207668301&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
      },
      {
        text: '鸡肉卷',
        img: 'https://img1.baidu.com/it/u=2617048388,173066499&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
      },
      {
        text: '薯条',
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F022R1101525%2F21022Q01525-9-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658398577&t=7124e43f9018c247ecc7160a04004fa0',
      },
    ],
    大餐: [
      {
        text: '火锅',
        img: 'https://img2.baidu.com/it/u=3699208834,2646089679&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=333',
      },
      {
        text: '串串',
        img: 'https://img2.baidu.com/it/u=2113778501,1604825293&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400',
      },
      {
        text: '烤肉',
        img: 'https://img0.baidu.com/it/u=1408386244,3710876263&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
      },
      {
        text: '烤全羊',
        img: 'https://img0.baidu.com/it/u=4285189757,1564247455&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375',
      },
    ],
  } as const;

  type TFoodKeys = keyof typeof allFood;

  const [type, setType] = useState<TFoodKeys>('快餐');

  const [prizes, setPrizes] = useState<TPrizes | null>(null);

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

  useEffect(() => {
    const cur = allFood[type].map((item, index) => {
      const newItem = {
        background: index % 2 ? '#e9e8fe' : '#b8c5f2',
        range: 25,
        fonts: [{ text: item.text }],
        imgs: [
          {
            src: item.img ?? '',
            height: '50px',
            width: '60px',
            top: '30px',
          },
        ],
      };
      return newItem;
    });
    setPrizes(cur);
  }, [type]);

  const myLucky = useRef<TMethods>();

  const renderFoodType = () => {
    let keys = Object.keys(allFood);

    return (
      <div className=' mb-3'>
        <Tab
          options={keys}
          value={type}
          onChange={(value: string) => {
            setType(value as any);
          }}
        />
      </div>
    );
  };

  return (
    <div className=' w-full h-full'>
      <div className=' w-full text-center absolute top-1/2 left-1/2  -translate-x-1/2  -translate-y-1/2 '>
        {renderFoodType()}
        <div className={` text-5xl text-center mb-10  `}>
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
              myLucky.current!.play();

              myLucky.current!.stop();
            }}
            onEnd={(prize: any) => {
              if (prize.fonts) {
                setTarget(prize.fonts[0].text);
              }
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
