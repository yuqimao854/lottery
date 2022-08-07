import React, { FC, useEffect, useRef, useState } from "react";
import { LuckyWheel } from "@lucky-canvas/react";
import Tab from "./Tab";

const Weekend: FC = () => {
  const [target, setTarget] = useState("");
  const [image, setImage] = useState("");
  const [blocks] = useState([
    { padding: "10px", background: "#e9e8fe" },
    { padding: "10px", background: "#869cfa" },
  ]);

  const allChoice = {
    weekend: [
      {
        text: "学习",
        img: "https://img2.baidu.com/it/u=1567913580,4230846359&fm=253&fmt=auto&app=138&f=JPEG?w=658&h=439",
      },
      {
        text: "打游戏",
        img: "https://img2.baidu.com/it/u=157576817,45563585&fm=253&fmt=auto&app=138&f=JPEG?w=560&h=373",
      },
      {
        text: "唱歌",
        img: "https://img2.baidu.com/it/u=208066740,2765928421&fm=253&fmt=auto&app=120&f=JPEG?w=620&h=399",
      },
      {
        text: "躺尸",
        img: "https://img0.baidu.com/it/u=311426565,100286978&fm=253&fmt=auto&app=138&f=JPG?w=800&h=500",
      },
    ],
  } as const;

  const [prizes, setPrizes] = useState<TPrizes | null>(null);

  const [buttons] = useState([
    { radius: "40%", background: "#617df2" },
    { radius: "35%", background: "#afc8ff" },
    {
      radius: "30%",
      background: "#869cfa",
      pointer: true,
      fonts: [{ text: "开始", top: "-10px" }],
    },
  ]);

  useEffect(() => {
    const cur = allChoice.weekend.map((item, index) => {
      const newItem = {
        background: index % 2 ? "#e9e8fe" : "#b8c5f2",
        range: index === 0 ? 1 : 33,
        fonts: [{ text: item.text }],
        imgs: [
          {
            src: item.img ?? "",
            height: "50px",
            width: "60px",
            top: "30px",
          },
        ],
      };
      return newItem;
    });
    setPrizes(cur);
  }, []);

  const myLucky = useRef<TMethods>();

  return (
    <div className=" w-full h-full">
      <div className=" w-full text-center absolute top-1/2 left-1/2  -translate-x-1/2  -translate-y-1/2 ">
        <div className={` text-5xl text-center mb-10  `}>
          {target ? (
            <div className="target">我要{target}!!!</div>
          ) : (
            <div> 周末做些什么呢？</div>
          )}
        </div>
        {target ? (
          <div className=" mx-auto w-[300px]">
            <img src={image} />
            <div
              className=" mt-4 cursor-pointer bg-cyan-100  w-auto"
              onClick={() => {
                setImage("");
                setTarget("");
              }}
            >
              重新选择
            </div>
          </div>
        ) : (
          <div className=" mx-auto w-[300px]">
            <LuckyWheel
              ref={myLucky}
              width="300px"
              height="300px"
              blocks={blocks}
              prizes={prizes}
              buttons={buttons}
              onStart={() => {
                setTarget("");
                myLucky.current!.play();

                myLucky.current!.stop();
              }}
              onEnd={(prize: any) => {
                if (prize.fonts) {
                  setTarget(prize.fonts[0].text);
                  setImage(prize.imgs[0].src);
                }
              }}
              accelerationTime={1000}
              decelerationTime={1000}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Weekend;
