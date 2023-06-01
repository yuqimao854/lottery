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
  const showListRef = useRef(showList);
  const movingRef = useRef(moving);
  const isStart = useRef(false);
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
    const { item: startItem, type } = START_LIST[getRandom(START_LIST.length)];
    movingType.current.type = type;
    movingType.current.transferred = false;
    const maxMoveStep = Math.min(
      ...startItem.map((item) => item.toString(2).match(/0/g)?.length ?? 0)
    );
    const random = getRandom(maxMoveStep);
    const randomStartItem = startItem.map((item) => item >> random);

    return randomStartItem;
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
    const lastNewIndex = movingList.findLastIndex((item) => item);
    const movingBinary = decimalToBinary(movingList[lastNewIndex] ?? 0);
    const targetBinary = decimalToBinary(targetList[lastNewIndex] ?? 0);
    movingBinary.split('').map((item, index) => {
      if (item === '1' && targetBinary[index] === '1') {
        isTrigger = true;
      }
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
      isStart.current = false;
      timer && clearInterval(timer);
      console.log('over');
    }
  };

  const handleDown = () => {
    if (!isStart.current) {
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
    if (!isStart.current) {
      return;
    }
    const newMoving = onLeft(movingRef.current);
    if (isTrigger(newMoving, showListRef.current)) {
      return;
    }
    setMoving(newMoving);
  };

  const handleRight = () => {
    if (!isStart.current) {
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
    if (!isStart.current) {
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

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          handleLeft();
          break;
        case 'ArrowRight':
          handleRight();
          break;
        case 'ArrowDown':
          handleDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleTransfer();
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div>
      <div>
        <div style={{ marginBottom: 50, display: 'flex' }}>
          <div
            onClick={() => {
              isStart.current = true;
              totalScore.current = 0;
              handleStart();
              timer = setInterval(() => {
                handleDown();
              }, 600);
            }}
            className='mr-4'
          >
            start
          </div>
          <div
            className='mr-4'
            onClick={() => {
              setMoving(new Array(ROW).fill(0));
              setShowList(new Array(ROW).fill(0));
              isStart.current = false;
              totalScore.current = 0;
              timer && clearInterval(timer);
              timer = null;
            }}
          >
            reset
          </div>
          <div
            className='mr-4'
            onClick={() => {
              handleLeft();
            }}
          >
            left
          </div>
          <div
            className='mr-4'
            onClick={() => {
              handleRight();
            }}
          >
            right
          </div>
          <div
            onClick={() => {
              handleDown();
            }}
          >
            down
          </div>
        </div>
        <div>{totalScore.current}</div>
        <div
          style={{
            position: 'relative',
            border: '1px solid gray',
            width: 'fit-content',
          }}
        >
          <div>
            {showList.map((item) => {
              return (
                <div style={{ display: 'flex' }}>
                  {decimalToBinary(item)
                    .split('')
                    .map((item) => {
                      return (
                        <div
                          style={{
                            opacity: item === '1' ? 1 : 0,
                            background: '#191B1F',
                            margin: 1,
                            width: 30,
                            height: 30,
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
            {moving.map((item) => {
              return (
                <div style={{ display: 'flex' }}>
                  {decimalToBinary(item)
                    .split('')
                    .map((item) => {
                      return (
                        <div
                          style={{
                            background: '#191B1F',
                            opacity: item === '1' ? 1 : 0,
                            width: 30,
                            height: 30,
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
      </div>
    </div>
  );
};
