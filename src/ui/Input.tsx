import {Field, Input as InputUI, Label} from '@headlessui/react';
import {ForwardedRef, forwardRef, InputHTMLAttributes} from 'react';

export type InputProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef(function Input(
  {label, ...inputProps}: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <Field>
      <input type="button" value="" />
      <Label className="text-sm">{label}</Label>
      <InputUI
        ref={ref}
        className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
        {...inputProps}
      />
    </Field>
  );
});
