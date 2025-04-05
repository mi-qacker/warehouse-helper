import {ButtonHTMLAttributes, ForwardedRef, forwardRef} from 'react';
import {Button as ButtonUI} from '@headlessui/react';
import clsx from 'clsx';

export type ButtonProps = {
  label: string;
  color?: 'lime' | 'red' | 'amber';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default forwardRef(function Button(
  {label, color = 'lime', ...buttonProps}: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const colorClasses = {
    lime: 'bg-lime-500 data-[hover]:bg-lime-600',
    red: 'bg-red-500 data-[hover]:bg-red-600',
    amber: 'bg-amber-500 data-[hover]:bg-amber-600',
  };

  return (
    <ButtonUI
      className={clsx(
        'cursor-pointer rounded-md px-3 py-2 font-semibold text-white shadow-inner',
        'focus:outline-none',
        colorClasses[color]
      )}
      ref={ref}
      {...buttonProps}
    >
      {label}
    </ButtonUI>
  );
});
