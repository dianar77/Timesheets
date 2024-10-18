import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import ClientTable from './components/List/ClientTable';
import ClientDetail from './components/Detail/ClientDetail';
import TimesheetTable from './components/List/TimesheetTable';
import VesselTable from './components/List/VesselTable';
import WorkOrderTable from './components/List/WorkOrderTable';
import ProjectTable from './components/List/ProjectTable';
import DisciplineTable from './components/List/DisciplineTable';
import DisciplineDetail from './components/Detail/DisciplineDetail';
import StaffTable from './components/List/StaffTable';
import StaffDetail from './components/Detail/StaffDetail';
import Sidebar from './components/Sidebars/Sidebar';
import ProjectDetail from './components/Detail/ProjectDetail';

import './App.css';

function DisciplineRoute() {
  const { id } = useParams();
console.log('xxxdd', id);
  return id ? (
    <DisciplineDetail />
  ) : (
    <DisciplineTable />
  );
}

function StaffRoute() {
  const { id } = useParams();
  console.log('xxxss', id);
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

function App() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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

  return (
    <Router>
      <div className="app" style={{ display: 'flex' }}>
        <Sidebar 
          onDisciplineSelect={handleDisciplineSelect} 
          onStaffSelect={handleStaffSelect}
          onClientSelect={handleClientSelect}
          onProjectSelect={handleProjectSelect}
        />
        <div className="content" style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/clients" element={<ClientRoute />} />
            <Route path="/clients/:id" element={<ClientRoute />} />
            <Route path="/timesheets" element={<TimesheetTable />} />
            <Route path="/vessels" element={<VesselTable />} />
            <Route path="/workorders" element={<WorkOrderTable />} />
            <Route path="/projects" element={<ProjectRoute />} />
            <Route path="/projects/:id" element={<ProjectRoute />} />
            <Route path="/disciplines" element={<DisciplineRoute />} />
            <Route path="/disciplines/:id" element={<DisciplineRoute />} />
            <Route path="/staffs" element={<StaffRoute />} />
            <Route path="/staffs/:id" element={<StaffRoute />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
