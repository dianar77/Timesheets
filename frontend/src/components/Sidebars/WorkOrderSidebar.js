import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function WorkOrderSidebar({ onWorkOrderSelect }) {
  const [workOrders, setWorkOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get('/api/workorders/dropdown/list');
      setWorkOrders(response.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  const handleWorkOrderClick = (workOrderId) => {
    onWorkOrderSelect(workOrderId);
    navigate(`/workorders/${workOrderId}`);
  };

  return (
    <SubMenu key="workorders" icon={<FileOutlined />} title={<Link to="/workorders">Work Orders</Link>}>
      {workOrders.map(workOrder => (
        <Menu.Item key={`workorder-${workOrder.id}`} onClick={() => handleWorkOrderClick(workOrder.id)}>
          {workOrder.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default WorkOrderSidebar;
