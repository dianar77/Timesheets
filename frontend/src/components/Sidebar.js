import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { 
  OrderedListOutlined, 
  ClockCircleOutlined, 
  TeamOutlined, 
  FileOutlined, 
  ProjectOutlined,
  ToolOutlined,
  UserOutlined
} from '@ant-design/icons';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <Menu mode="inline" theme="dark">
        <Menu.Item key="vessels" icon={<OrderedListOutlined />}>
          <Link to="/vessels">Vessels</Link>
        </Menu.Item>
        <Menu.Item key="timesheets" icon={<ClockCircleOutlined />}>
          <Link to="/timesheets">Timesheets</Link>
        </Menu.Item>
        <Menu.Item key="clients" icon={<TeamOutlined />}>
          <Link to="/clients">Clients</Link>
        </Menu.Item>
        <Menu.Item key="workorders" icon={<FileOutlined />}>
          <Link to="/workorders">Work Orders</Link>
        </Menu.Item>
        <Menu.Item key="projects" icon={<ProjectOutlined />}>
          <Link to="/projects">Projects</Link>
        </Menu.Item>
        <Menu.Item key="disciplines" icon={<ToolOutlined />}>
          <Link to="/disciplines">Disciplines</Link>
        </Menu.Item>
        <Menu.Item key="staff" icon={<UserOutlined />}>
          <Link to="/staff">Staff</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
