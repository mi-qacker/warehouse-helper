'use client';

import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import {JSX, useMemo} from 'react';
import {CargoParams} from './CargoParams';
import {ShelvingParams} from './ShelvingParams';
import {WarehouseParams} from './WarehouseParams';

type ParamCategory = {
  key: string;
  label: string;
  content: JSX.Element;
};

export function Params() {
  const paramCategories = useMemo<ParamCategory[]>(
    () => [
      {key: 'warehouse', label: 'Склад', content: <WarehouseParams />},
      {key: 'shelving', label: 'Стеллажи', content: <ShelvingParams />},
      {key: 'cargo', label: 'Груз', content: <CargoParams />},
    ],
    []
  );

  return (
    <div className="h-full rounded-r-md bg-neutral-100 p-4 shadow-md">
      <div className="mb-4 text-center text-lg underline">Параметры склада</div>

      <TabGroup>
        <TabList className="flex gap-4">
          {paramCategories.map(({key, label}) => (
            <Tab
              key={key}
              className="px-2 outline-none data-[hover]:underline data-[selected]:bg-blue-600 data-[selected]:text-white"
            >
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {paramCategories.map(({key, content}) => (
            <TabPanel key={key}>{content}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
