declare module '@lucky-canvas/react';
type TMethods = {
  init: () => void;
  stop: (number?: number) => void;
  play: () => void;
};

type TPrizes = Array<{
  range?: number;
  background?: string;
  fonts?: {
    text?: string;
    top?: string | number;
    fontColor?: string;
    fontSize?: string | number;
    fontStyle?: string;
    fontWeight?: string | number;
    lineHeight?: string | number;
    wordWrap?: boolean;
    lengthLimit?: string | number;
    lineClamp?: number;
  }[];
  imgs: {
    src?: string;
    top?: string | number;
    width?: string | number;
    height?: string | number;
  }[];
}>;
