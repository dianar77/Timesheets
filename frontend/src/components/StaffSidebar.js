import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { getStaffDropdownList } from '../services/api';

const { SubMenu } = Menu;

function StaffSidebar({ onStaffSelect }) {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await getStaffDropdownList();
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleStaffClick = (staffId) => {
    onStaffSelect(staffId);
    navigate(`/staff/${staffId}`);
  };

  return (
    <SubMenu key="staff" icon={<UserOutlined />} title={<Link to="/staffs">Staff</Link>}>
      {staff.map(member => (
        <Menu.Item key={`staff-${member.id}`} onClick={() => handleStaffClick(member.id)}>
          {member.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default StaffSidebar;
