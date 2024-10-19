import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TeamOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function StaffSidebar({ onStaffSelect, isExpanded, onExpand }) {
  const [staffs, setStaffs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const response = await axios.get('/api/staffs/dropdown/list');
      setStaffs(response.data);
    } catch (error) {
      console.error('Error fetching staffs:', error);
    }
  };

  const handleStaffClick = (staffId) => {
    onStaffSelect(staffId);
    navigate(`/staffs/${staffId}`);
  };

  return (
    <SubMenu
      key="staffsSubmenu"
      icon={<TeamOutlined />}
      title={<Link to="/staffs">Staffs</Link>}
      onTitleClick={() => onExpand()}
      open={isExpanded}
    >
      {staffs.map(staff => (
        <Menu.Item key={`staff-${staff.id}`} onClick={() => handleStaffClick(staff.id)}>
          {staff.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default StaffSidebar;
