import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProjectOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function ProjectSidebar({ onProjectSelect, isExpanded, onExpand }) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects/dropdown/list');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectClick = (projectId) => {
    onProjectSelect(projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <SubMenu
      key="projectsSubmenu"
      icon={<ProjectOutlined />}
      title={<Link to="/projects">Projects</Link>}
      onTitleClick={() => onExpand()}
      open={isExpanded}
    >
      {projects.map(project => (
        <Menu.Item key={`project-${project.id}`} onClick={() => handleProjectClick(project.id)}>
          {project.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default ProjectSidebar;
