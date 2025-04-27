'use client';

import { Button, Input, Form, Card } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/services/requests/authRequest';

interface LoginFormValues {
	username: string;
	password: string;
}
  
export default function LoginPage() {
  const { login } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    await login(new LoginRequest(values.username, values.password));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
