import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToolOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function VesselSidebar({ onVesselSelect }) {
  const [vessels, setVessels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVessels();
  }, []);

  const fetchVessels = async () => {
    try {
      const response = await axios.get('/api/vessels/dropdown/list');
      setVessels(response.data);
    } catch (error) {
      console.error('Error fetching vessels:', error);
    }
  };

  const handleVesselClick = (vesselId) => {
    onVesselSelect(vesselId);
    navigate(`/vessels/${vesselId}`);
  };

  return (
    <SubMenu key="vessels" icon={<ToolOutlined />} title={<Link to="/vessels">Vessels</Link>}>
      {vessels.map(vessel => (
        <Menu.Item key={`vessel-${vessel.id}`} onClick={() => handleVesselClick(vessel.id)}>
          {vessel.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default VesselSidebar;
