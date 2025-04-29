'use client';

import { Layout } from 'antd';
import AdminSidebar from '@/components/AdminSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Content } = Layout;

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProtectedRoute>
			<Layout style={{ minHeight: '100vh' }}>
				<AdminSidebar />
				<Layout>
					<Content className="p-6 bg-gray-50">
						{children}
					</Content>
				</Layout>
			</Layout>
		</ProtectedRoute>
	);
}
