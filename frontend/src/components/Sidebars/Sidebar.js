import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { 
  OrderedListOutlined, 
  ClockCircleOutlined, 
  TeamOutlined, 
  FileOutlined, 
  ProjectOutlined
} from '@ant-design/icons';
import './Sidebar.css';
import DisciplineSidebar from './DisciplineSidebar';
import StaffSidebar from './StaffSidebar';
import ClientSidebar from './ClientSidebar';
import ProjectSidebar from './ProjectSidebar';
import VesselSidebar from './VesselSidebar';
import WorkOrderSidebar from './WorkOrderSidebar';
import TimesheetSidebar from './TimesheetSidebar';

function Sidebar({ onDisciplineSelect, onStaffSelect, onClientSelect, onProjectSelect, onVesselSelect, onWorkOrderSelect, onTimesheetSelect }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleExpand = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <Menu mode="inline" theme="dark">
        <VesselSidebar onVesselSelect={onVesselSelect} isExpanded={expandedItem === 'vessel'} onExpand={() => handleExpand('vessel')} />
        <WorkOrderSidebar onWorkOrderSelect={onWorkOrderSelect} isExpanded={expandedItem === 'workOrder'} onExpand={() => handleExpand('workOrder')} />
        <TimesheetSidebar onTimesheetSelect={onTimesheetSelect} isExpanded={expandedItem === 'timesheet'} onExpand={() => handleExpand('timesheet')} />
        <ProjectSidebar onProjectSelect={onProjectSelect} isExpanded={expandedItem === 'project'} onExpand={() => handleExpand('project')} />
        <ClientSidebar onClientSelect={onClientSelect} isExpanded={expandedItem === 'client'} onExpand={() => handleExpand('client')} />
        <DisciplineSidebar onDisciplineSelect={onDisciplineSelect} isExpanded={expandedItem === 'discipline'} onExpand={() => handleExpand('discipline')} />
        <StaffSidebar onStaffSelect={onStaffSelect} isExpanded={expandedItem === 'staff'} onExpand={() => handleExpand('staff')} />
      </Menu>
    </div>
  );
}

export default Sidebar;
