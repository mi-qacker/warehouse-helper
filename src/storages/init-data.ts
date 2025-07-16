import TEMPLATE_DATA from './templates/small';
import {WarehouseStore} from './types';

export const DEMO_DATA: Pick<
  WarehouseStore,
  'warehouse' | 'products' | 'cells' | 'graph'
> = TEMPLATE_DATA;
