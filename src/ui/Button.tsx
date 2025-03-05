import {ButtonHTMLAttributes, ForwardedRef, forwardRef} from 'react';
import {Button as ButtonUI} from '@headlessui/react';
import clsx from 'clsx';

export type ButtonProps = {
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef(function Button(
  {label, ...buttonProps}: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <ButtonUI
      className={clsx(
        'cursor-pointer rounded-md bg-lime-500 px-3 py-2 font-semibold text-white shadow-inner',
        'focus:outline-none data-[hover]:bg-lime-600'
      )}
      ref={ref}
      {...buttonProps}
    >
      {label}
    </ButtonUI>
  );
});
