'use client';

import {useCallback, useState} from 'react';
import {Button, Dialog, DialogPanel, DialogTitle} from '@headlessui/react';

export default function AboutPage() {
  const [isDialogOpen, setDialogIsOpen] = useState(false);

  const onResetLocalStore = useCallback(() => {
    localStorage.clear();
    location.reload();
  }, []);

  const openDialog = useCallback(() => {
    setDialogIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogIsOpen(false);
  }, []);

  return (
    <main className="container mx-auto">
      <h1 className="mt-2 mb-4 text-2xl font-bold">About Page</h1>
      <p className="my-2">звуки перекати поле 🏜️</p>
      <Button
        onClick={openDialog}
        className="cursor-pointer rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500 focus:not-data-focus:outline-none"
      >
        Show hidden props
      </Button>

      <Dialog
        open={isDialogOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={closeDialog}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-neutral-800 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3" className="text-base font-medium text-white">
                Поздравляю, ты открыл скрытые настройки!
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Тут ты можешь сбросить свой localStore если в твоем складе все
                сломалось и нужно начать с чистого листа.
              </p>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-fuchsia-700 p-2 text-sm font-semibold text-white hover:bg-fuchsia-600"
                  onClick={onResetLocalStore}
                >
                  ДА, УДАЛИ ВЕСЬ МОЙ СКЛАД!
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
