import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClockCircleOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function TimesheetSidebar({ onTimesheetSelect, isExpanded, onExpand }) {
  const [timesheets, setTimesheets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      const response = await axios.get('/api/timesheets/dropdown/list');
      setTimesheets(response.data);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleTimesheetClick = (timesheetId) => {
    onTimesheetSelect(timesheetId);
    navigate(`/timesheets/${timesheetId}`);
  };

  return (
    <SubMenu
      key="timesheets"
      icon={<ClockCircleOutlined />}
      title={<Link to="/timesheets">Timesheets</Link>}
      onTitleClick={onExpand}
      open={isExpanded}
    >
      {timesheets.map(timesheet => (
        <Menu.Item key={`timesheet-${timesheet.id}`} onClick={() => handleTimesheetClick(timesheet.id)}>
          {`${timesheet.name}`}
        </Menu.Item>
      ))}
    </SubMenu>
  );
}

export default TimesheetSidebar;
