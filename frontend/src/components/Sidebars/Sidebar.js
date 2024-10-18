import React from 'react';
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

function Sidebar({ onDisciplineSelect, onStaffSelect, onClientSelect, onProjectSelect,onVesselSelect,onWorkOrderSelect }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <Menu mode="inline" theme="dark">
        <VesselSidebar onVesselSelect={onVesselSelect} />
        <Menu.Item key="timesheets" icon={<ClockCircleOutlined />}>
          <Link to="/timesheets">Timesheets</Link>
        </Menu.Item>
        <WorkOrderSidebar onWorkOrderSelect={onWorkOrderSelect} />
        <ProjectSidebar onProjectSelect={onProjectSelect} />
        <ClientSidebar onClientSelect={onClientSelect} />
        <DisciplineSidebar onDisciplineSelect={onDisciplineSelect} />
        <StaffSidebar onStaffSelect={onStaffSelect} />
        
      </Menu>
    </div>
  );
}

export default Sidebar;
