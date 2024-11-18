import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { RegisterFormValues } from '../interfaces/Auth.interface';
import { registerUser } from '../api/auth';

interface RegisterFormProps {
    onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: RegisterFormValues) => {
        setLoading(true);
        try {
            await registerUser(values);
            message.success('Registration successful! Please log in.');
            onSuccess();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" name="registerForm" onFinish={onFinish}>
            <Form.Item
                label="Email Address"
                name="email_address"
                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
            >
                <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                hasFeedback
            >
                <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="password_confirmation"
                dependencies={['password']}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('The two passwords do not match!');
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
