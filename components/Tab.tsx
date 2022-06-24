import React, { FC, useState } from 'react';

interface ITabProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Tab: FC<ITabProps> = (props: ITabProps) => {
  const { options, value, onChange } = props;
  const [active, setActive] = useState(value ?? options[0]);
  const handleChange = (value: string) => {
    setActive(value);
    onChange(value);
  };
  return (
    <div className=' cursor-pointer transition-all mx-auto scro w-1/2 flex text-center justify-center space-x-4'>
      {options.map((item) => {
        return (
          <div
            key={item}
            className={`${
              active === item ? ' border-b border-blue-300 text-lg' : ''
            }`}
            onClick={() => {
              handleChange(item);
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

export default Tab;
