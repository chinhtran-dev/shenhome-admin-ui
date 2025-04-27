'use client';

import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Badge, message, Typography } from 'antd';
import { CategoryService } from '@/services/categoryService';
import { SearchRequest } from '@/services/requests/baseRequest';
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/services/requests/categoryRequest';
import { CategorySearchResponse } from '@/services/responses/categoryResponse';

export default function CategoryListPage() {
	const [categories, setCategories] = useState<CategorySearchResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentCategory, setCurrentCategory] = useState<CategorySearchResponse | null>(null);
	const [form] = Form.useForm();
	const [filterName, setFilterName] = useState('');

	const categoryService = useMemo(() => new CategoryService(), []);

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		try {
			setLoading(true);
			const request = new SearchRequest(true);
			const response = await categoryService.search(request);
			setCategories(response.data);
		} catch (error) {
			message.error('Failed to load categories');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const openModal = async (category?: CategorySearchResponse) => {
		if (category) {
			try {
				setLoading(true);
				const data = await categoryService.view(category.id);
				setCurrentCategory(data);
				form.setFieldsValue({ name: data.name });
			} catch (error) {
				message.error('Failed to load category details');
				console.error(error);
				return;
			} finally {
				setLoading(false);
			}
		} else {
			setCurrentCategory(null);
			form.resetFields();
		}
		setModalVisible(true);
	};

	const closeModal = () => {
		form.resetFields();
		setCurrentCategory(null);
		setModalVisible(false);
	};

	const handleSubmit = async (values: { name: string }) => {
		try {
			setLoading(true);
			if (currentCategory) {
				const request = new UpdateCategoryRequest(values.name);
				await categoryService.update(request, currentCategory.id);
				message.success('Category updated successfully');
			} else {
				const request = new CreateCategoryRequest(values.name);
				await categoryService.create(request);
				message.success('Category created successfully');
			}
			closeModal();
			await loadCategories();
		} catch (error) {
			message.error(currentCategory ? 'Failed to update category' : 'Failed to create category');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			setLoading(true);
			await categoryService.delete(id);
			message.success('Category deleted successfully');
			await loadCategories();
		} catch (error) {
			message.error('Failed to delete category');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(filterName.toLowerCase())
	);

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
					status={status === 'Enabled' ? 'success' : 'error'}
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
			title: 'Created On',
			dataIndex: 'createdOn',
			key: 'createdOn',
		},
		{
			title: 'Modified On',
			dataIndex: 'modifiedOn',
			key: 'modifiedOn',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_: undefined, record: CategorySearchResponse) => (
				<Space size="middle">
					<Button type="link" onClick={() => openModal(record)}>Edit</Button>
					<Popconfirm
						title="Are you sure to delete?"
						onConfirm={() => handleDelete(record.id)}
					>
						<Button type="link" danger>Delete</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Categories</h1>
				<Button type="primary" onClick={() => openModal()}>Create Category</Button>
			</div>

			<div className="mb-4">
				<Input
					placeholder="Search by name"
					value={filterName}
					onChange={(e) => setFilterName(e.target.value)}
				/>
			</div>

			<Table
				loading={loading}
				columns={columns}
				dataSource={filteredCategories}
				rowKey="id"
			/>

			<Modal
				title={currentCategory ? 'Edit Category' : 'Create Category'}
				open={modalVisible}
				onCancel={closeModal}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
				>
					{currentCategory && (
						<>
							<Form.Item label="ID">
								<Typography.Text>{currentCategory.id}</Typography.Text>
							</Form.Item>

							<Form.Item label="Status">
								<Input value={currentCategory.status} />
							</Form.Item>

							<Form.Item label="Created On">
								<Input value={currentCategory.createdOn} disabled />
							</Form.Item>

							<Form.Item label="Modified On">
								<Input value={currentCategory.modifiedOn} disabled />
							</Form.Item>
						</>
					)}

					<Form.Item
						label="Name"
						name="name"
						rules={[{ required: true, message: 'Please input the category name!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block loading={loading}>
							{currentCategory ? 'Save Changes' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>

		</div>
	);
}
