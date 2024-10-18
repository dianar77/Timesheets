import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const { SubMenu } = Menu;

function Sidebar({ onDisciplineSelect }) {
  const [disciplines, setDisciplines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      const response = await axios.get('/api/disciplines/dropdown/list');
      setDisciplines(response.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
    }
  };

  const handleDisciplineClick = (disciplineId) => {
    onDisciplineSelect(disciplineId);
    navigate(`/disciplines/${disciplineId}`);
  };

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
        <SubMenu key="disciplines" icon={<ToolOutlined />} title={<Link to="/disciplines">Disciplines</Link>}>
          {disciplines.map(discipline => (
            <Menu.Item key={`discipline-${discipline.id}`} onClick={() => handleDisciplineClick(discipline.id)}>
              {discipline.name}
            </Menu.Item>
          ))}
        </SubMenu>
        <Menu.Item key="staff" icon={<UserOutlined />}>
          <Link to="/staff">Staff</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
