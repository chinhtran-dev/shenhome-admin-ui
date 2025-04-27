'use client';

import { Table, Button, Space, Popconfirm, Modal, Form, Input, Badge } from 'antd';
import { useState } from 'react';
import { mockCategories, Category } from '@/dto/category'; // Giả sử mock data nằm trong file mockData.tsx

export default function CategoryListPage() {
	const [categories, setCategories] = useState<Category[]>(mockCategories);
	const [filteredCategories, setFilteredCategories] = useState<Category[]>(mockCategories); // State cho danh sách đã lọc
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentCategory, setCurrentCategory] = useState<Category | null>(null); // Category hiện tại (null cho Create)
	const [form] = Form.useForm();
	const [filterName, setFilterName] = useState(''); // State để lưu giá trị filter

	// Xử lý delete category
	const handleDelete = (id: string) => {
		setCategories(categories.filter((c) => c.id !== id));
		setFilteredCategories(filteredCategories.filter((c) => c.id !== id)); // Cập nhật filteredCategories
	};

	// Xử lý Create hoặc Edit category
	const handleCreateOrEdit = (values: Category) => {
		if (currentCategory) {
			// Chỉnh sửa category
			const updatedCategory = { ...currentCategory, name: values.name };
			setCategories(
				categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
			);
			setFilteredCategories(
				filteredCategories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
			);
		} else {
			// Tạo mới category
			const newCategory: Category = {
				id: (categories.length + 1).toString(),
				name: values.name,
			};
			setCategories([...categories, newCategory]);
			setFilteredCategories([...filteredCategories, newCategory]);
		}
		setIsModalVisible(false);
		setCurrentCategory(null);
	};

	// Mở Modal để chỉnh sửa category
	const handleEdit = (category: Category) => {
		setCurrentCategory(category);
		form.setFieldsValue({ name: category.name });
		setIsModalVisible(true);
	};

	// Mở Modal để tạo mới category
	const handleCreate = () => {
		setCurrentCategory(null); // Reset khi tạo mới
		form.resetFields(); // Reset form khi tạo mới
		setIsModalVisible(true);
	};

	// Hàm filter danh sách categories theo tên
	const handleFilterChange = (value: string) => {
		setFilterName(value);
		if (value) {
			setFilteredCategories(
				categories.filter((cat) =>
					cat.name.toLowerCase().includes(value.toLowerCase())
				)
			);
		} else {
			setFilteredCategories(categories);
		}
	};

	// Cột trong Table
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Badge
					status={status === 'Enabled' ? 'success' : 'error'} // Đánh dấu thành công khi Enabled, lỗi khi Disabled
					text={status}
				/>
			),
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'CreatedOn',
			dataIndex: 'createdOn',
			key: 'createdOn',
		},
		{
			title: 'ModifiedOn',
			dataIndex: 'modifiedOn',
			key: 'modifiedOn',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_: undefined, record: Category) => (
				<Space size="middle">
					<Button type="link" onClick={() => handleEdit(record)}>
						Edit
					</Button>
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => handleDelete(record.id)}
					>
						<Button type="link" danger>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Categories</h1>
				<Button type="primary" onClick={handleCreate}>
					Create Category
				</Button>
			</div>

			{/* Filter Input */}
			<div className="mb-4">
				<Input
					placeholder="Search by name"
					value={filterName}
					onChange={(e) => handleFilterChange(e.target.value)}
				/>
			</div>

			<Table columns={columns} dataSource={filteredCategories} rowKey="id" />

			<Modal
				title={currentCategory ? 'Edit Category' : 'Create Category'}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleCreateOrEdit}
				>
					<Form.Item
						label="Name"
						name="name"
						rules={[{ required: true, message: 'Please input the category name!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							{currentCategory ? 'Save Changes' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
