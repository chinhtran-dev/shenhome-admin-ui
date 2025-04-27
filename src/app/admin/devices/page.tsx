'use client'

import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Badge, message, Select } from 'antd';
import { DeviceService } from '@/services/deviceService';
import { SearchRequest } from '@/services/requests/baseRequest';
import { CreateDeviceRequest, UpdateDeviceRequest } from '@/services/requests/deviceRequest';
import { DeviceSearchResponse, DeviceViewResponse } from '@/services/responses/deviceResponse';
import { DeviceProfileService } from '@/services/deviceProfileService';
import { ListSelectItem } from '@/services/responses/deviceProfileResponse';

const { Option } = Select;

export default function DeviceListPage() {
  const [devices, setDevices] = useState<DeviceSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceViewResponse | null>(null);
  const [form] = Form.useForm();
  const [filterName, setFilterName] = useState('');
  const [deviceProfiles, setDeviceProfiles] = useState<ListSelectItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const deviceService = useMemo(() => new DeviceService(), []);
  const deviceProfileService = useMemo(() => new DeviceProfileService(), []);

  useEffect(() => {
    loadDevices();
    loadDeviceProfiles();
  }, []);

  const loadDeviceProfiles = async () => {
    try {
      const data = await deviceProfileService.listSelect();
      setDeviceProfiles(data);
    } catch (error) {
      message.error('Failed to load device profiles');
      console.error(error);
    }
  };

  const loadDevices = async (page: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      const request = new SearchRequest(true, undefined, undefined, page, pageSize);
      const response = await deviceService.search(request);
      setDevices(response.data);
      setPagination({
        current: response.pageNum,
        pageSize: response.pageSize,
        total: response.totalRecords,
      });
    } catch (error) {
      message.error('Failed to load devices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    loadDevices(pagination.current, pagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deviceService.delete(id);
      message.success('Device deleted successfully');
      await loadDevices(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete device');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (device: DeviceSearchResponse) => {
    try {
      setLoading(true);
      const data = await deviceService.view(device.id);
      setCurrentDevice(data);
      form.setFieldsValue({
        name: data.name,
        deviceProfileId: data.deviceProfileId,
        status: data.status
      });
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to load device details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentDevice(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'Enabled'
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (currentDevice) {
        const request = new UpdateDeviceRequest(
          values.name,
          values.deviceProfileId
        );
        await deviceService.update(request, currentDevice.id);
        message.success('Device updated successfully');
      } else {
        const request = new CreateDeviceRequest(
          values.name,
          values.deviceProfileId
        );
        await deviceService.create(request);
        message.success('Device created successfully');
      }
      setModalVisible(false);
      await loadDevices(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(currentDevice ? 'Failed to update device' : 'Failed to create device');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterName(value);
    loadDevices(1, pagination.pageSize);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
	  ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Enabled' ? 'success' : 'error'} text={status} />
      ),
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Device Token',
      dataIndex: 'deviceToken',
      key: 'deviceToken',
      render: (deviceToken: string) => {
        const truncatedToken = deviceToken.length > 20 
          ? `${deviceToken.slice(0, 8)}...${deviceToken.slice(-8)}` 
          : deviceToken;
        
        return (
          <Space>
            <span title={deviceToken}>{truncatedToken}</span>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(deviceToken);
                message.success('Device Token copied!');
              }} 
              type="link"
            >
              Copy
            </Button>
          </Space>
        );
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Heartbeat',
      dataIndex: 'heartbeat',
      key: 'heartbeat',
      render: (heartbeat: boolean) => (
        <Badge status={heartbeat ? 'success' : 'error'} text={heartbeat ? 'Active' : 'Inactive'} />
      ),
      width: 120,
    },
    {
      title: 'Last Heartbeat',
      dataIndex: 'lastHeartbeat',
      key: 'lastHeartbeat',
      width: 150,
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: 150,
    },
    {
      title: 'Modified On',
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      width: 150,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: undefined, record: DeviceSearchResponse) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Devices</h1>
        <Button type="primary" onClick={handleCreate}>
          Create Device
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
        dataSource={devices}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}  // Enables horizontal scroll
      />

      <Modal
        title={currentDevice ? 'Edit Device' : 'Create Device'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentDevice && (
          <>
            <Form.Item label="Id">
              <Input disabled value={currentDevice.id} />
            </Form.Item>
          </>
        )}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            label="Name" 
            name="name"
            rules={[{ required: true, message: 'Please input device name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Device Profile"
            name="deviceProfileId"
            rules={[{ required: true, message: 'Please select a device profile!' }]}
          >
            <Select placeholder="Select device profile" value={currentDevice?.deviceProfileId}>
              {deviceProfiles.map((profile) => (
                <Option key={profile.id} value={profile.id}>
                  {profile.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {currentDevice && (
            <>
              <Form.Item label="Device Token">
                <Input disabled value={currentDevice.deviceToken} />
              </Form.Item>

              <Form.Item label="Heartbeat Status">
                <Badge 
                  status={currentDevice.heartbeat ? 'success' : 'error'} 
                  text={currentDevice.heartbeat ? 'Active' : 'Inactive'} 
                />
              </Form.Item>

              <Form.Item label="Last Heartbeat">
                <Input disabled value={currentDevice.lastHeartbeat || 'N/A'} />
              </Form.Item>
            </>
          )}

          <Form.Item className="mt-4">
            <Button type="primary" htmlType="submit" loading={loading} block>
              {'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
