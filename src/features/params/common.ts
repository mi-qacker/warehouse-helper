import {type SelectProps} from '@/ui/forms/Select';

export const ZONE_CONDITION_OPTIONS: SelectProps['options'] = [
  {value: 'cold', label: 'Холодильная'},
  {value: 'dry', label: 'Сухая'},
  {value: 'normal', label: 'Обычная'},
];
