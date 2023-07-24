import * as Popover from '@radix-ui/react-popover';
import { Chat } from 'phosphor-react';

import { WidgetForm } from '../components/WidgetForm';

export default function Home() {
  return (
    <div className="flex flex-col items-end justify-end w-screen h-screen gap-4 p-8 bg-black">
      <Popover.Root>
        <Popover.Portal>
          <Popover.Content align="end" sideOffset={16}>
            <WidgetForm />
          </Popover.Content>
        </Popover.Portal>

        <Popover.Trigger className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-500 hover:bg-violet-600">
          <Chat className="w-5 h-5 text-white" weight="bold" />
        </Popover.Trigger>
      </Popover.Root>
    </div>
  );
}
