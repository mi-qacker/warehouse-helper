import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import {JSX, useCallback, useEffect, useState} from 'react';
import CellParams from './cells/CellParams';
import ProductParams from './products/ProductParams';

const SEARCH_PARAMS_KEY = 'tabIndex';

type ParamCategory = {
  key: string;
  label: string;
  content: JSX.Element;
};

const PARAM_CATEGORIES: ParamCategory[] = [
  {key: 'product', label: 'Товары', content: <ProductParams />},
  {key: 'cell', label: 'Ячейки', content: <CellParams />},
];

export default function Params() {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>();

  useEffect(() => {
    const currentURL = new URL(window.location.href);
    if (currentURL.searchParams.has(SEARCH_PARAMS_KEY)) {
      const tabIndex = Number(currentURL.searchParams.get(SEARCH_PARAMS_KEY));
      setSelectedTabIndex(tabIndex);
    }
  }, []);

  const tabIndexChanged = useCallback((index: number) => {
    const currentURL = new URL(window.location.href);
    currentURL.searchParams.set(SEARCH_PARAMS_KEY, index.toString());
    setSelectedTabIndex(index);
    window.history.replaceState({}, '', currentURL);
  }, []);

  return (
    <div className="h-full rounded-r-md bg-neutral-100 p-4 shadow-md">
      <div className="mb-4 text-center text-lg underline">Параметры склада</div>

      <TabGroup selectedIndex={selectedTabIndex} onChange={tabIndexChanged}>
        <TabList className="flex gap-4">
          {PARAM_CATEGORIES.map(({key, label}) => (
            <Tab
              key={key}
              className="px-2 outline-none data-[hover]:underline data-[selected]:bg-blue-600 data-[selected]:text-white"
            >
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {PARAM_CATEGORIES.map(({key, content}) => (
            <TabPanel key={key}>{content}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
