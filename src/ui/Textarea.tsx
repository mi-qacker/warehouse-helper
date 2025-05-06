import {Field, Textarea as TextareaUI, Label} from '@headlessui/react';
import {ForwardedRef, forwardRef, TextareaHTMLAttributes} from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default forwardRef(function Textarea(
  {children, ...textareaProps}: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <Field>
      <Label className="text-sm">{children}</Label>
      <TextareaUI
        ref={ref}
        className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
        {...textareaProps}
      />
    </Field>
  );
});
