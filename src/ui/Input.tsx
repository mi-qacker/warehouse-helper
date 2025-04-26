import {Field, Input as InputUI, Label} from '@headlessui/react';
import {ForwardedRef, forwardRef, InputHTMLAttributes} from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default forwardRef(function Input(
  {children, ...inputProps}: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <Field>
      <Label className="text-sm">{children}</Label>
      <InputUI
        ref={ref}
        className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
        {...inputProps}
      />
    </Field>
  );
});
