import { FC, useState } from 'react';
import _ from 'lodash';
const ORIGIN_PANEL = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const ALL_COUNT = 9;
const CONSECUTIVE_CHESS = 3;
const ROW = 3;
const COL = 3;

export const TicTacToe: FC = () => {
  const [currentPanel, setCurrentPanel] = useState(ORIGIN_PANEL);
  const [player, setPlayer] = useState(1);
  const [count, setCount] = useState(0);
  const [isWin, setIsWin] = useState(false);

  const handleChess = (
    currentPanel: number[][],
    player: number,
    rowIndex: number,
    colIndex: number
  ) => {
    if (isWin) {
      return;
    }
    const newCurrentPanel = _.cloneDeep(currentPanel);
    newCurrentPanel[rowIndex][colIndex] = player;

    setCurrentPanel(newCurrentPanel);
    const isSuccess = checkIsSuccess(newCurrentPanel, rowIndex, colIndex);
    if (isSuccess) {
      setIsWin(isSuccess);
      console.log(`player:${player} win`);
      return;
    }
    setPlayer(player === 1 ? 2 : 1);
    const newCount = count + 1;
    setCount(newCount);
  };

  const checkIsSuccess = (
    newCurrentPanel: number[][],
    rowIndex: number,
    colIndex: number
  ): boolean => {
    const target = newCurrentPanel[rowIndex][colIndex];
    //TOP
    let startRowIndex = rowIndex;
    let startColIndex = colIndex;
    let isSuccess = true;
    while (startRowIndex > 0) {
      if (newCurrentPanel[startRowIndex - 1][startColIndex] === target) {
        startRowIndex--;
      } else {
        break;
      }
    }

    for (let i = 0; i < CONSECUTIVE_CHESS; i++) {
      if (newCurrentPanel[startRowIndex + i]?.[startColIndex] !== target) {
        isSuccess = false;
      }
    }
    if (isSuccess) {
      return true;
    }
    //LEFT
    startRowIndex = rowIndex;
    startColIndex = colIndex;
    isSuccess = true;
    while (startColIndex > 0) {
      if (newCurrentPanel[startRowIndex][startColIndex - 1] === target) {
        startColIndex--;
      } else {
        break;
      }
    }
    for (let i = 0; i < CONSECUTIVE_CHESS; i++) {
      if (newCurrentPanel[startRowIndex]?.[startColIndex + i] !== target) {
        isSuccess = false;
      }
    }
    if (isSuccess) {
      return true;
    }
    //LEFT TOP
    startRowIndex = rowIndex;
    startColIndex = colIndex;
    isSuccess = true;
    while (startColIndex > 0 && startRowIndex > 0) {
      if (newCurrentPanel[startRowIndex - 1]?.[startColIndex - 1] === target) {
        startColIndex--;
        startRowIndex--;
      } else {
        break;
      }
    }
    for (let i = 0; i < CONSECUTIVE_CHESS; i++) {
      if (newCurrentPanel[startRowIndex + i]?.[startColIndex + i] !== target) {
        isSuccess = false;
      }
    }
    if (isSuccess) {
      return true;
    }
    //RIGHT TOP
    startRowIndex = rowIndex;
    startColIndex = colIndex;
    isSuccess = true;
    while (startRowIndex > 0 && startColIndex < COL) {
      if (newCurrentPanel[startRowIndex - 1]?.[startColIndex + 1] === target) {
        startRowIndex--;
        startColIndex++;
      } else {
        break;
      }
    }
    for (let i = 0; i < CONSECUTIVE_CHESS; i++) {
      if (newCurrentPanel[startRowIndex + i]?.[startColIndex - i] !== target) {
        isSuccess = false;
      }
    }
    if (isSuccess) {
      return true;
    }

    return false;
  };

  const handleReset = () => {
    setCurrentPanel(ORIGIN_PANEL);
    setPlayer(1);
    setCount(0);
    setIsWin(false);
  };

  return (
    <div>
      <div
        onClick={() => {
          handleReset();
        }}
      >
        reset
      </div>
      <div>
        {currentPanel.map((row, rowIndex) => {
          return (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {row.map((col, colIndex) => {
                return (
                  <div
                    key={colIndex}
                    onClick={() => {
                      if (currentPanel[rowIndex][colIndex] === 0) {
                        handleChess(currentPanel, player, rowIndex, colIndex);
                      } else {
                        console.log('already exist');
                      }
                    }}
                  >
                    {col}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
