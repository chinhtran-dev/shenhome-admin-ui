'use client'
import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Select, Badge } from 'antd';
import { mockDeviceProfiles, DeviceProfile } from '@/dto/deviceProfile';
import { mockSelectCategories } from '@/dto/category';

const { Option } = Select;

export default function DeviceProfileListPage() {
	const [deviceProfiles, setDeviceProfiles] = useState<DeviceProfile[]>(mockDeviceProfiles);
	const [filteredProfiles, setFilteredProfiles] = useState<DeviceProfile[]>(mockDeviceProfiles);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentProfile, setCurrentProfile] = useState<DeviceProfile | null>(null);
	const [form] = Form.useForm();
	const [filterName, setFilterName] = useState('');

	const handleDelete = (id: string) => {
		setDeviceProfiles(deviceProfiles.filter((p) => p.id !== id));
		setFilteredProfiles(filteredProfiles.filter((p) => p.id !== id));
	};

	const handleCreateOrEdit = (values: DeviceProfile) => {
		if (currentProfile) {
			const updatedProfile = { ...currentProfile, ...values };
			setDeviceProfiles(
				deviceProfiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
			);
			setFilteredProfiles(
				filteredProfiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
			);
		} else {
			const newProfile: DeviceProfile = {
				...values,
				id: (deviceProfiles.length + 1).toString(),
				attributes: values.attributes || [],
				telemetries: values.telemetries || [],
			};
			setDeviceProfiles([...deviceProfiles, newProfile]);
			setFilteredProfiles([...filteredProfiles, newProfile]);
		}
		setIsModalVisible(false);
		setCurrentProfile(null);
	};

	const handleEdit = (profile: DeviceProfile) => {
		setCurrentProfile(profile);
		form.setFieldsValue(profile);
		setIsModalVisible(true);
	};

	const handleCreate = () => {
		setCurrentProfile(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleFilterChange = (value: string) => {
		setFilterName(value);
		if (value) {
			setFilteredProfiles(
				deviceProfiles.filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
			);
		} else {
			setFilteredProfiles(deviceProfiles);
		}
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
			render: (_: undefined, record: DeviceProfile) => (
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

			{/* Filter */}
			<div className="mb-4">
				<Input
					placeholder="Search by name"
					value={filterName}
					onChange={(e) => handleFilterChange(e.target.value)}
				/>
			</div>

			{/* Table */}
			<Table columns={columns} dataSource={filteredProfiles} rowKey="id" />

			{/* Modal */}
			<Modal
				title={currentProfile ? 'Edit Device Profile' : 'Create Device Profile'}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={800}
			>
				<Form form={form} layout="vertical" onFinish={handleCreateOrEdit} initialValues={{
					status: 'Enabled',
					attributes: currentProfile?.attributes || [{}],
					telemetries: currentProfile?.telemetries || [{}],
					commands: currentProfile?.commands || [{}],
				}}>
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
						<Select placeholder="Select type">
							<Option key={1} value="sensor">Sensor</Option>
							<Option key={2} value="actuator">Actuator</Option>
						</Select>
					</Form.Item>

					<Form.Item label="Status" name="status" rules={[{ required: true }]}>
						<Select>
							<Option key={1} value="Enabled">Enabled</Option>
							<Option key={2} value="Disabled">Disabled</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Category"
						name="category"
						rules={[{ required: true, message: 'Please select a category!' }]}
					>
						<Select placeholder="Select category" value={currentProfile?.categoryId}>
							{mockSelectCategories.map((category) => (
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
										<Form.Item {...restField} name={[name, 'key']} rules={[{ required: true, message: 'Key required' }]}>
											<Input placeholder="Key" />
										</Form.Item>
										<Form.Item {...restField} name={[name, 'type']} rules={[{ required: true, message: 'Type required' }]}>
											<Select placeholder="Select type">
												<Option key={1} value="string">String</Option>
												<Option key={2} value="float">Float</Option>
												<Option key={3} value="double">Double</Option>
												<Option key={4} value="int">Int</Option>
												<Option key={5} value="int">Boolean</Option>
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
										<Form.Item {...restField} name={[name, 'key']} rules={[{ required: true, message: 'Key required' }]}>
											<Input placeholder="Key" />
										</Form.Item>
										<Form.Item {...restField} name={[name, 'type']} rules={[{ required: true, message: 'Type required' }]}>
											<Select placeholder="Select type">
												<Option key={1} value="string">String</Option>
												<Option key={2} value="float">Float</Option>
												<Option key={3} value="double">Double</Option>
												<Option key={4} value="int">Int</Option>
												<Option key={4} value="int">Boolean</Option>
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

					{/* Commands List */}
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
										<Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Name required' }]}>
											<Input placeholder="Command Name" />
										</Form.Item>

										<Form.Item {...restField} name={[name, 'comparision']} rules={[{ required: true }]}>
											<Select placeholder="Select comparison">
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
						<Button type="primary" htmlType="submit" block>
							{currentProfile ? 'Save Changes' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
