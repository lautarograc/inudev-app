import React, { useState } from 'react';
import { Button, DatePicker, Space, Popover, Select } from 'antd';
import { Filters, filterPriority, filterStatus } from '../interfaces/Filters.interface';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface TodoFilterProps {
    onApply: (filters: Filters) => void;
    onClear: () => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ onApply, onClear }) => {
    const [createdFilterRange, setCreatedFilterRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [dueDateFilterRange, setDueDateFilterRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const handleApply = () => {
        const newFilters: Filters = {};

        if (createdFilterRange) {
            newFilters['created_at_gteq'] = createdFilterRange[0].format('YYYY-MM-DD');
            newFilters['created_at_lteq'] = createdFilterRange[1].format('YYYY-MM-DD');
        }
        if (dueDateFilterRange) {
            newFilters['due_date_gteq'] = dueDateFilterRange[0].format('YYYY-MM-DD');
            newFilters['due_date_lteq'] = dueDateFilterRange[1].format('YYYY-MM-DD');
        }
        if (selectedPriority) {
            newFilters['priority_eq'] = selectedPriority;
        }
        if (selectedStatus) {
            newFilters['status_eq'] = selectedStatus;
        }
        onApply(newFilters);
    };

    const handleClear = () => {
        setCreatedFilterRange(null);
        setDueDateFilterRange(null);
        setSelectedPriority(null);
        setSelectedStatus(null);
        onClear();
    };

    const filterContent = (
        <div style={{ padding: 8, maxWidth: 300 }}>
            <RangePicker
                value={createdFilterRange}
                onChange={(dates) => setCreatedFilterRange(dates as [Dayjs, Dayjs])}
                format="YYYY-MM-DD"
                style={{ width: '100%', marginBottom: 8 }}
                placeholder={['Start Date', 'End Date']}
            />
            <br />
            <RangePicker
                value={dueDateFilterRange}
                onChange={(dates) => setDueDateFilterRange(dates as [Dayjs, Dayjs])}
                format="YYYY-MM-DD"
                style={{ width: '100%', marginBottom: 8 }}
                placeholder={['Start Due Date', 'End Due Date']}
            />
            <Select
                value={selectedPriority}
                onChange={(value) => setSelectedPriority(value)}
                style={{ width: '100%', marginBottom: 8 }}
                placeholder="Priority"
            >
                {filterPriority.map((priority) => (
                    <Select.Option key={priority.value} value={priority.value}>
                        {priority.label}
                    </Select.Option>
                ))}
            </Select>
            <Select
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                style={{ width: '100%', marginBottom: 8 }}
                placeholder="Status"
            >
                {filterStatus.map((status) => (
                    <Select.Option key={status.value} value={status.value}>
                        {status.label}
                    </Select.Option>
                ))}
            </Select>
            <Space>
                <Button type="primary" onClick={handleApply}>
                    Apply
                </Button>
                <Button onClick={handleClear}>
                    Clear
                </Button>
            </Space>
        </div>
    );

    return (
        <Popover
            content={filterContent}
            title="Filter Todos"
            trigger="click"
            placement="bottomRight"
        >
            <Button>
                Filter
            </Button>
        </Popover>
    );
};

export default TodoFilter;
