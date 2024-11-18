export interface Filters {
    [key: string]: string;
}

export interface FilterOption {
    label: string;
    value: string;
}

export const filterPriority: FilterOption[] = [
    { label: 'Low Priority', value: 'low' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'High Priority', value: 'high' }
];

export const filterStatus: FilterOption[] = [
    { label: 'Not Started', value: 'not_started' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
];
