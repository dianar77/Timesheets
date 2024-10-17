import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, ContainerOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/timesheets">Timesheets</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<ContainerOutlined />}>
        <Link to="/vessels">Vessels</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<TeamOutlined />}>
        <Link to="/clients">Clients</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
