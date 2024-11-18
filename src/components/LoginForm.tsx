// LoginForm.tsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LoginFormValues } from '../interfaces/Auth.interface';
import { loginUser } from '../api/auth';

interface LoginFormProps {
    onSuccess: (token: string) => void;
}

interface LoginFormProps {
    onSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const response = await loginUser(values);
            const token = response.data.token;
            message.success('Login successful!');
            onSuccess(token);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" name="loginForm" onFinish={onFinish}>
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
            >
                <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
