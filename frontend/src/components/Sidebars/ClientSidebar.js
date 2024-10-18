import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TeamOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function ClientSidebar({ onClientSelect , isExpanded, onExpand }) {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients/dropdown/list');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientClick = (clientId) => {
    onClientSelect(clientId);
    navigate(`/clients/${clientId}`);
  };

  return (
    <SubMenu key="clients" icon={<TeamOutlined />} title={<Link to="/clients">Clients</Link>} onTitleClick={onExpand}
    open={isExpanded}>
      {clients.map(client => (
        <Menu.Item key={`client-${client.id}`} onClick={() => handleClientClick(client.id)}>
          {client.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default ClientSidebar;
