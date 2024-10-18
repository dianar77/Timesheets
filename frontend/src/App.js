import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import ClientsTable from './components/List/ClientsTable';
import TimesheetTable from './components/List/TimesheetTable';
import VesselTable from './components/List/VesselTable';
import WorkOrderTable from './components/List/WorkOrderTable';
import ProjectTable from './components/List/ProjectTable';
import DisciplineTable from './components/List/DisciplineTable';
import DisciplineDetail from './components/Detail/DisciplineDetail';
import StaffTable from './components/List/StaffTable';
import Sidebar from './components/Sidebar';
import './App.css';

function DisciplineRoute() {
  const { id } = useParams();

  return id ? (
    <DisciplineDetail />
  ) : (
    <DisciplineTable />
  );
}

function App() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState(null);

  const handleDisciplineSelect = (disciplineId) => {
    setSelectedDisciplineId(disciplineId);
  };

  const handleSave = () => {
    setSelectedDisciplineId(null);
  };

  const handleDelete = () => {
    setSelectedDisciplineId(null);
  };

  const handleCancel = () => {
    setSelectedDisciplineId(null);
  };

  return (
    <Router>
      <div className="app" style={{ display: 'flex' }}>
        <Sidebar onDisciplineSelect={handleDisciplineSelect} />
        <div className="content" style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/clients" element={<ClientsTable />} />
            <Route path="/timesheets" element={<TimesheetTable />} />
            <Route path="/vessels" element={<VesselTable />} />
            <Route path="/workorders" element={<WorkOrderTable />} />
            <Route path="/projects" element={<ProjectTable />} />
            <Route path="/disciplines" element={<DisciplineRoute />} />
            <Route path="/disciplines/:id" element={<DisciplineRoute />} />
            <Route path="/staff" element={<StaffTable />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
