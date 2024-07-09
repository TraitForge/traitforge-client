import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type ButtonTypes = {
  text: string;
  bg?: string;
  variant?: 'blue' | 'green' | 'orange' | 'purple' | 'secondary';
  width?: string | number;
  height?: string | number;
  textClass?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({
  text,
  bg,
  variant = 'blue',
  width,
  height,
  textClass,
  ...alt
}: ButtonTypes) => {
  const textClasses = classNames(
    'text-white hover:translate-y-[-2px] transition-all ease-in  font-electrolize py-4 px-12 rounded-xl text-[32px] whitespace-nowrap',
    textClass, {
      'bg-gradient-to-r to-neon-blue from-[#057977]': variant === 'blue',
      'bg-gradient-to-r to-neon-green from-[#144F33]': variant === 'green',
      'bg-gradient-to-r to-neon-orange from-[#663C15]': variant === 'orange',
      'bg-gradient-to-r to-neon-purple from-[#0C001F]': variant === 'purple',
      'bg-[#023340] bg-opacity-80': variant === 'secondary',
    }
  );

  return (
    <button className={textClasses} {...alt}>
      {text}
    </button>
  );
};
