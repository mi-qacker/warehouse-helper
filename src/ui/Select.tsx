import {Field, Label, Select as SelectUI} from '@headlessui/react';
import {forwardRef} from 'react';

export type SelectProps = {
  options: Array<
    {label: string} & React.OptionHTMLAttributes<HTMLOptionElement>
  >;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default forwardRef(function Select(
  {children, options, ...selectProps}: SelectProps,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <Field className="mt-2">
      <Label className="text-sm">{children}</Label>
      <SelectUI
        ref={ref}
        className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
        {...selectProps}
      >
        <option value="">Не выбран</option>
        {options.map(({label, ...option}, index) => (
          <option key={index} {...option}>
            {label}
          </option>
        ))}
      </SelectUI>
    </Field>
  );
});
