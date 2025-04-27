'use client';

import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  DatabaseOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';

const { Sider } = Layout;

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      collapsedWidth="80"
      style={{ minHeight: '100vh' }}
    >
      <div className="text-white text-center py-4 text-lg font-bold">
        {collapsed ? 'A' : 'Admin Panel'}
      </div>

      <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link href="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="categories" icon={<AppstoreOutlined />}>
          <Link href="/admin/categories">Categories</Link>
        </Menu.Item>
        <Menu.Item key="device-profiles" icon={<DeploymentUnitOutlined />}>
          <Link href="/admin/device-profiles">Device Profiles</Link>
        </Menu.Item>
        <Menu.Item key="devices" icon={<DatabaseOutlined />}>
          <Link href="/admin/devices">Devices</Link>
        </Menu.Item>
        <Menu.Item key="users" icon={<UsergroupAddOutlined />}>
          <Link href="/admin/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="setting" icon={<SettingOutlined />}>
          <Link href="/admin/settings">Setting</Link>
        </Menu.Item>
      </Menu>

      <div className="text-center py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
    </Sider>
  );
}
