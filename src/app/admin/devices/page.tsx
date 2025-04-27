'use client'
import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Badge, message, Select } from 'antd';
import { Device, mockDevices } from '@/dto/device';
import { mockDeviceProfilesSelect } from '@/dto/deviceProfile';

const { Option } = Select;

export default function DeviceListPage() {
	const [devices, setDevices] = useState<Device[]>(mockDevices);
	const [filteredDevices, setFilteredDevices] = useState<Device[]>(mockDevices);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
	const [filterName, setFilterName] = useState('');

	const handleDelete = (id: string) => {
		setDevices(devices.filter((d) => d.id !== id));
		setFilteredDevices(filteredDevices.filter((d) => d.id !== id));
	};

	const handleFilterChange = (value: string) => {
		setFilterName(value);
		if (value) {
			setFilteredDevices(
				devices.filter((d) => d.id.toLowerCase().includes(value.toLowerCase()))
			);
		} else {
			setFilteredDevices(devices);
		}
	};

	const handleCopyDeviceToken = (deviceToken: string) => {
		navigator.clipboard.writeText(deviceToken);
		message.success('Device Token copied to clipboard!');
	};

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
				<Badge status={status === 'Enabled' ? 'success' : 'error'} text={status} />
			),
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},

		// Ẩn Device Token trong bảng khi ở chế độ edit
		{
			title: 'Device Token',
			dataIndex: 'deviceToken',
			key: 'deviceToken',
			render: (deviceToken: string) => (

				<Space>
					<span>{deviceToken}</span>
					<Button onClick={() => handleCopyDeviceToken(deviceToken)} type="link">
						Copy
					</Button>
				</Space>
			),
		},
		{
			title: 'Heartbeat',
			dataIndex: 'heartbeat',
			key: 'heartbeat',
			render: (heartbeat: boolean) => (
				<span>{heartbeat ? 'Active' : 'Inactive'}</span>
			),
		},
		{
			title: 'Last Heartbeat',
			dataIndex: 'lastHeartbeat',
			key: 'lastHeartbeat',
			render: (lastHeartbeat: string) => (
				<span>{lastHeartbeat || 'N/A'}</span>
			),
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
			render: (_: undefined, record: Device) => (
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

	const handleEdit = (device: Device) => {
		setCurrentDevice(device);
		setIsModalVisible(true);
	};

	const handleCreate = () => {
		setCurrentDevice(null);
		setIsModalVisible(true);
	};

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Device List</h1>
				<Button type="primary" onClick={handleCreate}>
					Create Device
				</Button>
			</div>

			{/* Filter */}
			<div className="mb-4">
				<Input
					placeholder="Search by device ID"
					value={filterName}
					onChange={(e) => handleFilterChange(e.target.value)}
				/>
			</div>

			{/* Table */}
			<Table columns={columns} dataSource={filteredDevices} rowKey="id" />

			{/* Modal */}
			<Modal
				title={currentDevice ? 'Edit Device' : 'Create Device'}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={800}
			>
				<Form
					layout="vertical"
					initialValues={{
						status: currentDevice?.status || 'Enabled',
						name: currentDevice?.name || '',
						deviceToken: currentDevice?.deviceToken || '',
						heartbeat: currentDevice?.heartbeat || false,
						lastHeartbeat: currentDevice?.lastHeartbeat || '',
					}}
				>
					<Form.Item label="Device ID" name="id">
						<Input disabled={!!currentDevice} />
					</Form.Item>

					<Form.Item label="Name" name="name">
						<Input />
					</Form.Item>

					<Form.Item label="Type" name="type">
						<Select>
							<Option value="sensor">Sensor</Option>
							<Option value="actuator">Actuator</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Device Profile"
						name="Device Profile"
						rules={[{ required: true, message: 'Please select a device profile!' }]}
					>
						<Select placeholder="Select device profile" value={currentDevice?.deviceProfileId}>
							{mockDeviceProfilesSelect.map((dp) => (
								<Option key={dp.id} value={dp.id}>
									{dp.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					{/* Ẩn các trường này khi tạo mới */}
					{currentDevice && (
						<>
							<Form.Item label="Device Token" name="deviceToken">
								<Input disabled={true} value={currentDevice?.deviceToken} />
							</Form.Item>

							<Form.Item label="Heartbeat" name="heartbeat" valuePropName="checked">
								<span>{currentDevice.heartbeat ? 'Active' : 'Inactive'}</span>
							</Form.Item>

							<Form.Item label="Last Heartbeat" name="lastHeartbeat">
								<Input disabled={true} value={currentDevice?.lastHeartbeat || 'N/A'} />
							</Form.Item>
						</>
					)}

					<Form.Item className="mt-4">
						<Button type="primary" htmlType="submit" block>
							{currentDevice ? 'Save Changes' : 'Create Device'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
