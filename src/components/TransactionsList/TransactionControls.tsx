import type { SortField, SortDirection, Status } from '@/components/TransactionsList/TransactionsList';
import { Select, type SelectOption } from '../shared/Select';

interface TransactionControlsProps {
    sortField: SortField;
    sortDirection: SortDirection;
    status: Status;
    onSortFieldChange: (value: SortField) => void;
    onSortDirectionChange: (value: SortDirection) => void;
    onStatusChange: (value: Status) => void;
}

const sortFieldOptions: SelectOption<SortField>[] = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'none', label: 'None' }
];

const sortDirectionOptions: SelectOption<SortDirection>[] = [
    { value: 'desc', label: 'Highest First' },
    { value: 'asc', label: 'Lowest First' }
];

const statusOptions: SelectOption<Status>[] = [
    { value: 'all', label: 'All' },
    { value: 'processing', label: 'Processing' },
    { value: 'settled', label: 'Settled' },
    { value: 'failed', label: 'Failed' }
];

const TransactionControls = ({
    sortField,
    sortDirection,
    status,
    onSortFieldChange,
    onSortDirectionChange,
    onStatusChange
}: TransactionControlsProps) => {
    return (
        <div className="mb-2 flex items-center justify-end space-x-4 px-4">
            <Select
                value={sortField}
                onValueChange={onSortFieldChange}
                options={sortFieldOptions}
                placeholder="Sort by..."
                label="Sort by field"
            />
            {sortField !== 'none' && (
                <Select
                    value={sortDirection}
                    onValueChange={onSortDirectionChange}
                    options={sortDirectionOptions}
                    placeholder="Order by..."
                    label="Sort direction"
                />
            )}
            <Select
                value={status}
                onValueChange={onStatusChange}
                options={statusOptions}
                placeholder="Status..."
                label="Filter by status"
            />
        </div>
    );
};

export default TransactionControls;
