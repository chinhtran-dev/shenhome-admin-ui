'use client'
import { Card, Typography, Row, Col, Button } from 'antd';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className='p-20'>
      <Title level={2}>Welcome to Admin Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Card Title" variant={undefined} hoverable>
            <p>Content</p>
            <Button type="primary" onClick={() => router.push('/admin/settings')}>
              Go to Settings
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card Title" variant={undefined} hoverable>
            <p>Content</p>
            <Button type="primary" onClick={() => router.push('/admin/users')}>
              Go to Users
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card Title" variant={undefined} hoverable>
            <p>Content</p>
            <Button type="primary" onClick={() => router.push('/admin/reports')}>
              View Reports
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
