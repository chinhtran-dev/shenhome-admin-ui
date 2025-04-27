'use client'

import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Select, Badge, message } from 'antd';
import { DeviceProfileService } from '@/services/deviceProfileService';
import { SearchRequest } from '@/services/requests/baseRequest';
import { CreateDeviceProfileRequest, UpdateDeviceProfileRequest } from '@/services/requests/deviceProfileRequest';
import { DeviceProfileSearchResponse, DeviceProfileViewResponse } from '@/services/responses/deviceProfileResponse';
import { CategoryService } from '@/services/categoryService';
import { CategoryListSelectItem } from '@/services/responses/categoryResponse';

const { Option } = Select;

export default function DeviceProfileListPage() {
	const [deviceProfiles, setDeviceProfiles] = useState<DeviceProfileSearchResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentProfile, setCurrentProfile] = useState<DeviceProfileViewResponse | null>(null);
	const [form] = Form.useForm();
	const [filterName, setFilterName] = useState('');
	const [categories, setCategories] = useState<CategoryListSelectItem[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0
	});

	const deviceProfileService = useMemo(() => new DeviceProfileService(), []);
	const categoryService = useMemo(() => new CategoryService(), []);

	useEffect(() => {
		loadDeviceProfiles();
		loadCategories();
	}, []);

	const loadCategories = async () => {
		try {
			const data = await categoryService.listSelect();
			console.log(data);
			setCategories(data);
		} catch (error) {
			message.error('Failed to load categories');
			console.error(error);
		}
	};

	const loadDeviceProfiles = async (page: number = 1, pageSize: number = 10) => {
		try {
			setLoading(true);
			const request = new SearchRequest(true, undefined, undefined, page, pageSize);
			const response = await deviceProfileService.search(request);
			setDeviceProfiles(response.data);
			setPagination({
				current: response.pageNum,
				pageSize: response.pageSize,
				total: response.totalRecords
			});
		} catch (error) {
			message.error('Failed to load device profiles');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleTableChange = (pagination: any) => {
		loadDeviceProfiles(pagination.current, pagination.pageSize);
	};

	const handleDelete = async (id: string) => {
		try {
			setLoading(true);
			await deviceProfileService.delete(id);
			message.success('Device profile deleted successfully');
			await loadDeviceProfiles(pagination.current, pagination.pageSize);
		} catch (error) {
			message.error('Failed to delete device profile');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (profile: DeviceProfileViewResponse) => {
		try {
			setLoading(true);
			const data = await deviceProfileService.view(profile.id);
			setCurrentProfile(data);
			form.setFieldsValue({
				name: data.name,
				code: data.code,
				type: data.type,
				iconCodePoint: data.iconCodePoint,
				categoryId: data.categoryId,
				status: data.status,
				attributes: data.attributes != null ? data.attributes : [{}],
				telemetries: data.telemetries != null ? data.telemetries : [{}],
				commands: data.commands.length ? data.commands : [{}]
			});
			setModalVisible(true);
		} catch (error) {
			message.error('Failed to load device profile details');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setCurrentProfile(null);
		form.resetFields();
		form.setFieldsValue({
			status: 'Enabled',
			attributes: [{}],
			telemetries: [{}],
			commands: [{}]
		});
		setModalVisible(true);
	};

	const handleSubmit = async (values: any) => {
		try {
			setLoading(true);
			const formValues = form.getFieldsValue();
			console.log(formValues);
			
			const categoryId = values.categoryId;
			if (currentProfile) {
				const request = new UpdateDeviceProfileRequest(
					values.name,
					values.code,
					categoryId,
					values.type,
					values.iconCodePoint,
					values.attributes,
					values.telemetries,
					values.commands
				);
				console.log(request);
				await deviceProfileService.update(request, currentProfile.id);
				message.success('Device profile updated successfully');
			} else {
				const request = new CreateDeviceProfileRequest(
					values.name,
					values.code,
					categoryId,
					values.type,
					values.iconCodePoint,
					values.attributes,
					values.telemetries,
					values.commands
				);
				await deviceProfileService.create(request);
				message.success('Device profile created successfully');
			}
			setModalVisible(false);
			await loadDeviceProfiles(pagination.current, pagination.pageSize);
		} catch (error) {
			message.error(currentProfile ? 'Failed to update device profile' : 'Failed to create device profile');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (value: string) => {
		setFilterName(value);
		loadDeviceProfiles(1, pagination.pageSize);
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'IconCodePoint',
			dataIndex: 'iconCodePoint',
			key: 'iconCodePoint',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Badge status={status === 'Enabled' ? 'success' : 'error'} text={status} />
			),
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
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
			render: (_: undefined, record: DeviceProfileViewResponse) => (
				<Space size="middle">
					<Button type="link" onClick={() => handleEdit(record)}>
						Edit
					</Button>
					<Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
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
				<h1 className="text-2xl font-bold">Device Profiles</h1>
				<Button type="primary" onClick={handleCreate}>
					Create Device Profile
				</Button>
			</div>

			<div className="mb-4">
				<Input
					placeholder="Search by name"
					value={filterName}
					onChange={(e) => handleFilterChange(e.target.value)}
				/>
			</div>

			<Table
				loading={loading}
				columns={columns}
				dataSource={deviceProfiles}
				rowKey="id"
				pagination={{
					current: pagination.current,
					pageSize: pagination.pageSize,
					total: pagination.total,
					showSizeChanger: true,
					showTotal: (total) => `Total ${total} items`
				}}
				onChange={handleTableChange}
			/>

			<Modal
				title={currentProfile ? 'Edit Device Profile' : 'Create Device Profile'}
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				footer={null}
				width={800}
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item label="Name" name="name" rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Code" name="code" rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Icon Code Point" name="iconCodePoint" rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Type" name="type" rules={[{ required: true }]}>
						<Select placeholder="Select type" value={currentProfile?.type}>
							<Option value="Sensor">Sensor</Option>
							<Option value="Actuator">Actuator</Option>
						</Select>
					</Form.Item>

					<Form.Item label="Status" name="status" rules={[{ required: true }]}>
						<Select>
							<Option value="Enabled">Enabled</Option>
							<Option value="Disabled">Disabled</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Category"
						name="categoryId"
						rules={[{ required: true, message: 'Please select a category!' }]}
					>
						<Select placeholder="Select category" value={currentProfile?.categoryId}>
							{categories.map((category) => (
								<Option key={category.id} value={category.id}>
									{category.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					{/* Attributes Table */}
					<Form.List name="attributes">
						{(fields, { add, remove }) => (
							<>
								<div className="flex justify-between items-center mt-4 mb-2">
									<h2 className="font-semibold">Attributes</h2>
									<Button type="dashed" onClick={() => add()} size="small">
										Add Attribute
									</Button>
								</div>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item {...restField} name={[name, 'key']} rules={[{ required: true }]}>
											<Input placeholder="Key" />
										</Form.Item>
										<Form.Item {...restField} name={[name, 'type']} rules={[{ required: true }]}>
											<Select placeholder="Select type">
												<Option value="string">String</Option>
												<Option value="float">Float</Option>
												<Option value="double">Double</Option>
												<Option value="int">Int</Option>
												<Option value="boolean">Boolean</Option>
											</Select>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'unit']}>
											<Input placeholder="Unit (optional)" />
										</Form.Item>
										<Button danger onClick={() => remove(name)}>Delete</Button>
									</Space>
								))}
							</>
						)}
					</Form.List>

					{/* Telemetries Table */}
					<Form.List name="telemetries">
						{(fields, { add, remove }) => (
							<>
								<div className="flex justify-between items-center mt-4 mb-2">
									<h2 className="font-semibold">Telemetries</h2>
									<Button type="dashed" onClick={() => add()} size="small">
										Add Telemetry
									</Button>
								</div>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item {...restField} name={[name, 'key']} rules={[{ required: true }]}>
											<Input placeholder="Key" />
										</Form.Item>
										<Form.Item {...restField} name={[name, 'type']} rules={[{ required: true }]}>
											<Select placeholder="Select type">
												<Option value="string">String</Option>
												<Option value="float">Float</Option>
												<Option value="double">Double</Option>
												<Option value="int">Int</Option>
												<Option value="boolean">Boolean</Option>
											</Select>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'unit']}>
											<Input placeholder="Unit (optional)" />
										</Form.Item>
										<Button danger onClick={() => remove(name)}>Delete</Button>
									</Space>
								))}
							</>
						)}
					</Form.List>

					{/* Commands Table */}
					<Form.List name="commands">
						{(fields, { add, remove }) => (
							<>
								<div className="flex justify-between items-center mt-4 mb-2">
									<h2 className="font-semibold">Commands</h2>
									<Button type="dashed" onClick={() => add()} size="small">
										Add Command
									</Button>
								</div>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
											<Input placeholder="Name" />
										</Form.Item>
										<Form.Item {...restField} name={[name, 'comparision']} rules={[{ required: true }]}>
											<Select placeholder="Select Comparision">
												<Option value="eq">Equal</Option>
												<Option value="neq">Not Equal</Option>
												<Option value="gt">Greater Than</Option>
												<Option value="lt">Less Than</Option>
											</Select>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'property', 'key']} rules={[{ required: true }]}>
											<Input placeholder="Property Key" />
										</Form.Item>
										<Form.Item {...restField} name={[name, 'property', 'value']} rules={[{ required: true }]}>
											<Input placeholder="Property Value" />
										</Form.Item>
										<Button danger onClick={() => remove(name)}>Delete</Button>
									</Space>
								))}
							</>
						)}
					</Form.List>

					<Form.Item className="mt-4">
						<Button type="primary" htmlType="submit" loading={loading}>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
