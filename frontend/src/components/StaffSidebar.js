import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { getStaffsDropdownList } from '../services/Staffapi';

const { SubMenu } = Menu;

function StaffSidebar({ onStaffSelect }) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await getStaffsDropdownList();
      // Check if response is an array, if not, convert it to an array
      const staffArray = Array.isArray(response) ? response : Object.values(response);
      setStaff(staffArray);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleStaffClick = (staffId) => {
    onStaffSelect(staffId);
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
