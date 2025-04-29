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

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/categories">Categories</Link>,
    },
    {
      key: 'device-profiles',
      icon: <DeploymentUnitOutlined />,
      label: <Link href="/admin/device-profiles">Device Profiles</Link>,
    },
    {
      key: 'devices',
      icon: <DatabaseOutlined />,
      label: <Link href="/admin/devices">Devices</Link>,
    },
    {
      key: 'users',
      icon: <UsergroupAddOutlined />,
      label: <Link href="/admin/users">Users</Link>,
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Setting</Link>,
    },
  ];

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

      <Menu 
        theme="dark" 
        mode="inline" 
        defaultSelectedKeys={['dashboard']}
        items={menuItems}
      />

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