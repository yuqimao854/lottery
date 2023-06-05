import type { FC } from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import React from 'react';

const COL = 10;
const ROW = 16;
enum EType {
  I = 'I',
  O = 'O',
  Z = 'Z',
  L = 'L',
  W = 'W',
}

const getZeroLen = (len: number) => {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += '0';
  }
  return str;
};

const START_LIST = [
  {
    type: EType.W,
    item: [
      Number(`0b01${getZeroLen(COL - 2)}`),
      Number(`0b111${getZeroLen(COL - 3)}`),
    ],
  },
  {
    type: EType.O,
    item: [
      Number(`0b11${getZeroLen(COL - 2)}`),
      Number(`0b11${getZeroLen(COL - 2)}`),
    ],
  },
  {
    type: EType.I,
    item: [
      Number(`0b10${getZeroLen(COL - 2)}`),
      Number(`0b10${getZeroLen(COL - 2)}`),
      Number(`0b10${getZeroLen(COL - 2)}`),
      Number(`0b10${getZeroLen(COL - 2)}`),
    ],
  },
  {
    type: EType.L,
    item: [
      Number(`0b10${getZeroLen(COL - 2)}`),
      Number(`0b111${getZeroLen(COL - 3)}`),
    ],
  },
  {
    type: EType.L,
    item: [
      Number(`0b001${getZeroLen(COL - 3)}`),
      Number(`0b111${getZeroLen(COL - 3)}`),
    ],
  },
  {
    type: EType.Z,
    item: [
      Number(`0b11${getZeroLen(COL - 2)}`),
      Number(`0b011${getZeroLen(COL - 3)}`),
    ],
  },
];

let timer: NodeJS.Timer | null = null;

export const ELSBlock: FC = () => {
  const decimalToBinary = (value: number, len: number = COL) => {
    return (value || 0).toString(2).padStart(len, '0');
  };

  const getRandom = (n: number) => {
    return Math.floor(Math.random() * Math.floor(n));
  };

  const [showList, setShowList] = useState(new Array(ROW).fill(0));

  const [moving, setMoving] = useState(new Array(ROW).fill(0));
  const [isPaused, setIsPaused] = useState(false);
  const [isStared, setIsStared] = useState(false);
  const showListRef = useRef(showList);
  const movingRef = useRef(moving);
  const isGaming = useRef(false);
  const [gameOver, setGameOver] = useState(false);
  const nextBlockIndex = useRef<number>();
  const [nextBlock, setNextBlock] = useState<number[]>([]);
  const movingType = useRef({
    type: EType.I,
    transferred: false,
  });
  const totalScore = useRef(0);

  useEffect(() => {
    showListRef.current = showList;
  }, [showList]);

  useEffect(() => {
    movingRef.current = moving;
  }, [moving]);

  const onRight = (list: number[]) => {
    let cantMove = false;
    const newMoving = list.map((item) => {
      if (decimalToBinary(item).at(-1) === '1') {
        cantMove = true;
      }
      return item >> 1;
    });
    return cantMove ? list : newMoving;
  };

  const onLeft = (list: number[]) => {
    let cantMove = false;
    const newMoving = list.map((item) => {
      if (decimalToBinary(item).at(0) === '1') {
        cantMove = true;
      }
      return item << 1;
    });
    return cantMove ? list : newMoving;
  };

  const onDown = (list: number[]) => {
    const newMoving = [0, ...list.slice(0, -1)];
    return newMoving;
  };

  const onCreateNewBlock = () => {
    const { item: startItem, type } =
      START_LIST[
        nextBlockIndex.current === undefined
          ? getRandom(START_LIST.length)
          : nextBlockIndex.current
      ];

    nextBlockIndex.current = getRandom(START_LIST.length);
    movingType.current.type = type;
    movingType.current.transferred = false;
    const maxMoveStep = Math.min(
      ...startItem.map((item) => item.toString(2).match(/0/g)?.length ?? 0)
    );
    const random = getRandom(maxMoveStep);
    const randomStartItem = startItem.map((item) => item >> random);

    return randomStartItem;
  };

  const onGetNextNewBlock = () => {
    const { item: startItem } = START_LIST[nextBlockIndex.current ?? 0];
    return startItem;
  };

  const onStart = () => {
    const startItem = onCreateNewBlock();
    return startItem;
  };

  const onEndCurrent = (movingList: number[], targetList: number[]) => {
    const newTarget: number[] = [];
    targetList.map((item, index) => {
      if (item === 0) {
        newTarget[index] = movingList[index];
      } else {
        const movingBinary = decimalToBinary(movingList[index]);
        const targetBinary = decimalToBinary(targetList[index]);

        newTarget[index] =
          Number('0b' + movingBinary) ^ Number('0b' + targetBinary);
      }
    });

    return newTarget;
  };

  const isTrigger = (movingList: number[], targetList: number[]) => {
    let isTrigger = false;
    targetList.map((item, index) => {
      if (!item) {
        return;
      }
      const lastNewIndex = index;
      const movingBinary = decimalToBinary(movingList[lastNewIndex] ?? 0);
      const targetBinary = decimalToBinary(targetList[lastNewIndex] ?? 0);
      movingBinary.split('').map((item, index) => {
        if (item === '1' && targetBinary[index] === '1') {
          isTrigger = true;
        }
      });
    });
    return isTrigger;
  };

  const clearRow = (list: number[]) => {
    const newList: number[] = [];
    list.map((item) => {
      if (item === 2 ** COL - 1) {
        newList.unshift(0);
        totalScore.current += 1;
      } else {
        newList.push(item);
      }
    });
    return newList;
  };

  const handleStart = () => {
    const startItem = onStart();
    const newMoving = new Array(ROW).fill(0);

    startItem.forEach((item, index) => {
      newMoving[index] = item;
    });
    setMoving(newMoving);
    if (isTrigger(newMoving, showListRef.current)) {
      isGaming.current = false;
      setIsPaused(false);
      setIsStared(false);
      timer && clearInterval(timer);
      setGameOver(true);
    } else {
      setNextBlock(onGetNextNewBlock());
    }
  };

  const handleDown = () => {
    if (!isGaming.current) {
      return;
    }
    const newMoving = onDown(movingRef.current);

    if (isTrigger(newMoving, showListRef.current) || movingRef.current.at(-1)) {
      const endList = onEndCurrent(movingRef.current, showListRef.current);
      setMoving([]);
      const newList = clearRow(endList);
      setShowList(newList);
      handleStart();
      return;
    }
    setMoving(newMoving);
  };

  const handleLeft = () => {
    if (!isGaming.current) {
      return;
    }
    const newMoving = onLeft(movingRef.current);
    if (isTrigger(newMoving, showListRef.current)) {
      return;
    }
    setMoving(newMoving);
  };

  const handleRight = () => {
    if (!isGaming.current) {
      return;
    }
    const newMoving = onRight(movingRef.current);
    if (isTrigger(newMoving, showListRef.current)) {
      return;
    }
    setMoving(newMoving);
  };

  const onTransfer = (list: number[], type: EType) => {
    const allArray = list.map((item) => {
      return decimalToBinary(item).split('');
    });
    let transferred = true;

    const rotateArray = (type: EType) => {
      let center: number[] = [Infinity, Infinity];
      const size = 3;
      allArray.map((item, i) => {
        item.map((item, j) => {
          if (i === ROW - 1 || j == COL - 1) {
            return;
          }
          if (type === EType.W) {
            if (
              Number(allArray?.[i]?.[j - 1]) +
                Number(allArray?.[i]?.[j + 1]) +
                Number(allArray?.[i - 1]?.[j]) +
                Number(allArray?.[i + 1]?.[j]) ===
              3
            ) {
              center = [i, j];
            }
          }
          if (type === EType.L) {
            if (
              Number(allArray?.[i]?.[j - 1]) +
                Number(allArray?.[i]?.[j + 1]) ===
                2 ||
              Number(allArray?.[i - 1]?.[j]) +
                Number(allArray?.[i + 1]?.[j]) ===
                2
            ) {
              center = [i, j];
            }
          }
        });
      });

      const startI = center[0] - 1;
      const startJ = center[1] - 1;

      if (
        startI + size > ROW ||
        startJ + size > COL ||
        startI < 0 ||
        startJ < 0
      ) {
        return { list, transferred: false };
      }

      const sliceArray = allArray
        .slice(startI, startI + size + 1)
        .map((item) => item.slice(startJ, startJ + size + 1));

      const transferArray: string[][] = new Array(size)
        .fill(0)
        .map(() => new Array(size).fill('0'));

      for (let i = 0; i < size; i++) {
        for (let j = size - 1; j >= 0; j--) {
          transferArray[i][size - j - 1] = sliceArray[j][i];
        }
      }

      for (let i = 0; i < transferArray.length; i++) {
        for (let j = 0; j < transferArray[i].length; j++) {
          allArray[i + startI][j + startJ] = transferArray[i][j];
        }
      }
      const newTransferArray = allArray.map((item, index) => {
        return Number('0b' + item.join(''));
      });
      return { list: newTransferArray, transferred };
    };

    switch (type) {
      case EType.I: {
        let startI = -1;
        let startJ = -1;
        const size = 4;
        const newAllArray = allArray.map((item, i) => {
          return item.map((item, j) => {
            if (item === '1' && startI === -1 && startJ === -1) {
              startI = i;
              startJ = j;
            }
            if (movingType.current.transferred) {
              if (startI + size > ROW) {
                transferred = false;
              }
              if (j === startJ && i < startI + size) {
                return '1';
              }
              return '0';
            } else {
              if (startJ + size > COL) {
                transferred = false;
              }
              if (i === startI && j < startJ + size) {
                return '1';
              }
              return '0';
            }
          });
        });

        return {
          list: newAllArray.map((item) => Number('0b' + item.join(''))),
          transferred,
        };
      }
      case EType.W: {
        return rotateArray(type);
      }
      case EType.L: {
        return rotateArray(type);
      }
      case EType.Z: {
        let startI = -1;
        let startJ = -1;

        for (let i = 0; i < allArray.length; i++) {
          for (let j = 0; j < allArray[i].length; j++) {
            if (allArray[i][j] === '1' && startI === -1 && startJ === -1) {
              startI = i;
              startJ = j;
              break;
            }
          }
          if (startI !== -1 && startJ !== -1) {
            break;
          }
        }
        const newAllArray = allArray.map((item, i) => {
          return item.map((item, j) => {
            if (item === '1' && startI === -1 && startJ === -1) {
              startI = i;
              startJ = j;
            }
            if (movingType.current.transferred) {
              if (startJ === 1) {
                transferred = false;
              }
              if (
                (i === startI && (j === startJ - 1 || j === startJ - 2)) ||
                (i === startI + 1 && (j === startJ || j === startJ - 1))
              ) {
                return '1';
              }
              return '0';
            } else {
              if (startI >= ROW - 2) {
                transferred = false;
              }
              if (
                (i === startI && j === startJ + 2) ||
                (i === startI + 1 && (j === startJ + 1 || j === startJ + 2)) ||
                (i === startI + 2 && j == startJ + 1)
              ) {
                return '1';
              }
              return '0';
            }
          });
        });

        return {
          list: newAllArray.map((item) => Number('0b' + item.join(''))),
          transferred,
        };
      }

      default:
        break;
    }
    return { list, transferred: false };
  };
  const handleTransfer = () => {
    if (!isGaming.current) {
      return;
    }
    const { list: newTransfer, transferred } = onTransfer(
      movingRef.current,
      movingType.current.type
    );

    if (isTrigger(newTransfer, showListRef.current) || !transferred) {
      console.log('trigger return');
      return;
    }
    movingType.current.transferred = !movingType.current.transferred;
    setMoving(newTransfer);
  };

  const onDrop = () => {
    if (!isGaming.current) {
      return;
    }
    let resultMoving: number[] = [];
    let moving = movingRef.current;
    while (1) {
      if (isTrigger(onDown(moving), showListRef.current) || moving.at(-1)) {
        resultMoving = moving;
        break;
      }
      moving = onDown(moving);
    }

    setMoving(resultMoving);
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          handleLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleTransfer();
          break;
        case 'Space':
          e.preventDefault();
          onDrop();
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div className='flex h-[100vh] bg-red-900 flex-col  items-center content-center pt-4'>
      <div className='flex relative w-full  bg-slate-400 '>
        <div
          style={{
            position: 'relative',
            width: 'fit-content',
          }}
          className=' border-r-2 border-r-zinc-800'
        >
          <div>
            {showList.map((item, index) => {
              return (
                <div style={{ display: 'flex' }} key={'main' + index}>
                  {decimalToBinary(item)
                    .split('')
                    .map((item, index) => {
                      return (
                        <div
                          className='w-6 h-6'
                          key={'sub' + index}
                          style={{
                            opacity: item === '1' ? 1 : 0,
                            background: '#191B1F',
                            margin: 1,
                          }}
                        >
                          {/* {item} */}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {moving.map((item, index) => {
              return (
                <div key={'moving-main' + index} style={{ display: 'flex' }}>
                  {decimalToBinary(item)
                    .split('')
                    .map((item, index) => {
                      return (
                        <div
                          className='w-6 h-6'
                          key={'moving-sub' + index}
                          style={{
                            background: '#191B1F',
                            opacity: item === '1' ? 1 : 0,

                            margin: 1,
                          }}
                        >
                          {/* {item} */}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
        <div className=' text-center flex-1 overflow-hidden'>
          <div className=' '>Score</div>
          <div className='mt-3   font-bold text-4xl'>{totalScore.current}</div>

          <div className='mt-10 font-bold '>Next Block</div>
          <div className=' mt-10 translate-x-6'>
            {nextBlock.map((item, index) => {
              return (
                <div style={{ display: 'flex' }} key={'next_main' + index}>
                  {decimalToBinary(item)
                    .split('')
                    .slice(0, 4)
                    .map((item, index) => {
                      return (
                        <div
                          className='w-6 h-6'
                          key={'next_sub' + index}
                          style={{
                            opacity: item === '1' ? 1 : 0,
                            background: '#191B1F',
                            margin: 1,
                          }}
                        ></div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            background: 'black',
            opacity: isPaused || gameOver ? 0.8 : 0,
            width: '100%',
            height: '100%',
          }}
          className=' flex items-center justify-center'
        >
          <div className='text-center font-bold text-teal-50 text-8xl align-middle'>
            {isPaused ? 'Pause' : 'Game Over'}
          </div>
        </div>
      </div>
      <div className='flex  mt-4 mb-4'>
        <div className='mr-4  items-center flex justify-center flex-col'>
          <div
            onClick={() => {
              if (isStared) {
                return;
              }
              setIsStared(true);
              isGaming.current = true;
              totalScore.current = 0;
              handleStart();
              timer = setInterval(() => {
                handleDown();
              }, 600);
              setGameOver(false);
            }}
            className=' w-6  h-6 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl'
          ></div>
          <div className=' text-amber-100 '> on/off</div>
        </div>
        <div className='mr-4  items-center flex justify-center flex-col'>
          <div
            className='w-6  h-6 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl'
            onClick={() => {
              if (gameOver || !isStared) {
                return;
              }
              if (isGaming.current) {
                timer && clearInterval(timer);
                timer = null;
              } else {
                timer = setInterval(() => {
                  handleDown();
                }, 600);
              }
              isGaming.current = !isGaming.current;
              setIsPaused(!isPaused);
            }}
          ></div>
          <div className='text-amber-100'>pause/play</div>
        </div>

        <div className='mr-4  items-center flex justify-center flex-col'>
          <div
            className='w-6  h-6 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl '
            onClick={() => {
              setIsPaused(false);
              setIsStared(false);
              setMoving(new Array(ROW).fill(0));
              setShowList(new Array(ROW).fill(0));
              setNextBlock([]);
              setGameOver(false);
              isGaming.current = false;
              totalScore.current = 0;
              nextBlockIndex.current = undefined;
              timer && clearInterval(timer);
              timer = null;
            }}
          ></div>
          <div className='text-amber-100'> reset</div>
        </div>
      </div>
      <div className='flex mt-10   items-center '>
        <div>
          <div className='flex w-[9rem] justify-center'>
            <div
              className='text-amber-100  font-bold text-4xl leading-[3rem] text-center w-12  h-12 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl '
              onClick={() => {
                handleTransfer();
              }}
            >
              ↑
            </div>
          </div>
          <div className='flex  w-[9rem] justify-between'>
            <div
              className='text-amber-100 font-bold text-4xl leading-[3rem] text-center w-12  h-12 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl  '
              onClick={() => {
                handleLeft();
              }}
            >
              ←
            </div>
            <div
              className='text-amber-100 font-bold text-4xl leading-[3rem] text-center w-12  h-12 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl '
              onClick={() => {
                handleRight();
              }}
            >
              →
            </div>
          </div>
          <div className='flex w-[9rem] justify-center'>
            <div
              className='text-amber-100 font-bold text-4xl leading-[3rem] text-center w-12  h-12 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl '
              onClick={() => {
                handleDown();
              }}
            >
              ↓
            </div>
          </div>
        </div>
        <div className='ml-24'>
          <div
            onClick={() => {
              onDrop();
            }}
            className='font-bold text-4xl  text-center  w-24  h-24 rounded-[50%] bg-amber-400 active:bg-amber-600 active:shadow-2xl '
          ></div>
        </div>
      </div>
    </div>
  );
};
