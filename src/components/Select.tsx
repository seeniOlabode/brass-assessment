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
                className="inline-flex items-center justify-between px-3 py-2 text-sm gap-2 bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label={label}
            >
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className="overflow-hidden bg-white shadow-lg border border-gray-200" position='popper' sideOffset={5} align='end'>
                    <RadixSelect.Viewport className='divide-y divide-gray-200'>
                        {options.map((option) => (
                            <RadixSelect.Item 
                                key={option.value}
                                value={option.value} 
                                className="relative flex items-center px-6 py-2 text-sm text-gray-700 cursor-default select-none hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
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
