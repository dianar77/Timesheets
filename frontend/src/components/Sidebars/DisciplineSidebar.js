import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToolOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function DisciplineSidebar({ onDisciplineSelect }) {
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
    <SubMenu key="disciplines" icon={<ToolOutlined />} title={<Link to="/disciplines">Disciplines</Link>}>
      {disciplines.map(discipline => (
        <Menu.Item key={`discipline-${discipline.id}`} onClick={() => handleDisciplineClick(discipline.id)}>
          {discipline.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default DisciplineSidebar;
