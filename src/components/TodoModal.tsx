import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

interface TodoModalProps {
    visible: boolean;
    onOk: (item: any) => void;
    onCancel: () => void;
    item?: any;
}

const statusOptions = [
    { label: 'Not Started', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
];

const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

const TodoModal: React.FC<TodoModalProps> = ({ visible, onOk, onCancel, item }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (item) {
            form.setFieldsValue({
                name: item.name,
                description: item.description,
                due_date: item.due_date ? item.due_date.split('T')[0] : undefined,
                status: item.status,
                priority: item.priority
            });
        } else {
            form.resetFields();
        }
    }, [item, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const updatedItem = { ...item, ...values };
            onOk(updatedItem);
        });
    };

    return (
        <Modal
            title={item ? 'Edit Item' : 'Create Item'}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Title"
                    name="name"
                    rules={[{ required: true, message: 'Please input the name' }]}
                >
                    <Input placeholder="Enter name" />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="Enter description" />
                </Form.Item>
                <Form.Item label="Due Date" name="due_date">
                    <Input type="date" />
                </Form.Item>
                <Form.Item label="Status" name="status">
                    <Select options={statusOptions} />
                </Form.Item>
                <Form.Item label="Priority" name="priority">
                    <Select options={priorityOptions} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TodoModal;
