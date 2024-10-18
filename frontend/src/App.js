import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { Layout } from 'antd';
import ClientTable from './components/List/ClientTable';
import ClientDetail from './components/Detail/ClientDetail';
import TimesheetTable from './components/List/TimesheetTable';
import VesselTable from './components/List/VesselTable';
import VesselDetail from './components/Detail/VesselDetail';
import WorkOrderTable from './components/List/WorkOrderTable';
import WorkOrderDetail from './components/Detail/WorkOrderDetail';
import ProjectTable from './components/List/ProjectTable';
import ProjectDetail from './components/Detail/ProjectDetail';
import DisciplineTable from './components/List/DisciplineTable';
import DisciplineDetail from './components/Detail/DisciplineDetail';
import StaffTable from './components/List/StaffTable';
import StaffDetail from './components/Detail/StaffDetail';
import Sidebar from './components/Sidebars/Sidebar';

import './App.css';

const { Content } = Layout;

function DisciplineRoute() {
  const { id } = useParams();
  return id ? (
    <DisciplineDetail />
  ) : (
    <DisciplineTable />
  );
}

function StaffRoute() {
  const { id } = useParams();
  return id ? (
    <StaffDetail />
  ) : (
    <StaffTable />
  );
}

function ClientRoute() {
  const { id } = useParams();
  return id ? (
    <ClientDetail />
  ) : (
    <ClientTable />
  );
}

function ProjectRoute() {
  const { id } = useParams();
  return id ? (
    <ProjectDetail />
  ) : (
    <ProjectTable />
  );
}

function VesselRoute() {
  const { id } = useParams();
  return id ? (
    <VesselDetail />
  ) : (
    <VesselTable />
  );
}

function WorkOrderRoute() {
  const { id } = useParams();
  return id ? (
    <WorkOrderDetail />
  ) : (
    <WorkOrderTable />
  );
}

function App() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedVesselId, setSelectedVesselId] = useState(null);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(null);

  const handleDisciplineSelect = (disciplineId) => {
    setSelectedDisciplineId(disciplineId);
  };

  const handleStaffSelect = (staffId) => {
    setSelectedStaffId(staffId);
  };

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleVesselSelect = (vesselId) => {
    setSelectedVesselId(vesselId);
  };

  const handleWorkOrderSelect = (workOrderId) => {
    setSelectedWorkOrderId(workOrderId);
  };

  return (
    <Router>
      <div className="app" style={{ display: 'flex' }}>
        <Sidebar 
          onDisciplineSelect={handleDisciplineSelect} 
          onStaffSelect={handleStaffSelect}
          onClientSelect={handleClientSelect}
          onProjectSelect={handleProjectSelect}
          onVesselSelect={handleVesselSelect}
          onWorkOrderSelect={handleWorkOrderSelect}        
        />
        <div className="content" style={{ flex: 1, padding: '20px' }}>
          <Content>
            <Routes>
              <Route path="/clients" element={<ClientRoute />} />
              <Route path="/clients/:id" element={<ClientRoute />} />
              <Route path="/timesheets" element={<TimesheetTable />} />
              <Route path="/vessels" element={<VesselRoute />} />
              <Route path="/vessels/:id" element={<VesselRoute />} />
              <Route path="/workorders" element={<WorkOrderRoute />} />
              <Route path="/workorders/:id" element={<WorkOrderRoute />} />
              <Route path="/projects" element={<ProjectRoute />} />
              <Route path="/projects/:id" element={<ProjectRoute />} />
              <Route path="/disciplines" element={<DisciplineRoute />} />
              <Route path="/disciplines/:id" element={<DisciplineRoute />} />
              <Route path="/staffs" element={<StaffRoute />} />
              <Route path="/staffs/:id" element={<StaffRoute />} />
            </Routes>
          </Content>
        </div>
      </div>
    </Router>
  );
}

export default App;
