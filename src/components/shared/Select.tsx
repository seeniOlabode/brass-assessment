import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export interface SelectOption<T extends string> {
    value: T;
    label: string;
}

interface SelectProps<T extends string> {
    value: T;
    onValueChange: (value: T) => void;
    options: SelectOption<T>[];
    placeholder: string;
    label: string;
}

export function Select<T extends string>({
    value,
    onValueChange,
    options,
    placeholder,
    label
}: SelectProps<T>) {
    return (
        <RadixSelect.Root value={value} onValueChange={onValueChange}>
            <RadixSelect.Trigger
                className="inline-flex items-center justify-between px-3 py-2 text-sm gap-2 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label={label}
            >
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className="overflow-hidden bg-white dark:bg-zinc-950 shadow-lg border border-gray-200 dark:border-zinc-700" position='popper' sideOffset={5} align='end'>
                    <RadixSelect.Viewport className='divide-y divide-gray-200 dark:divide-zinc-700'>
                        {options.map((option) => (
                            <RadixSelect.Item
                                key={option.value}
                                value={option.value}
                                className="relative flex items-center px-6 py-2 text-sm text-gray-700 dark:text-white cursor-default select-none hover:bg-gray-100 dark:hover:bg-zinc-950 focus:outline-none focus:bg-gray-100 dark:focus:bg-zinc-900"
                            >
                                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                            </RadixSelect.Item>
                        ))}
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
}
