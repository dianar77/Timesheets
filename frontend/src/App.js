import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsTable from './components/ClientsTable';
import TimesheetTable from './components/TimesheetTable';
import VesselTable from './components/VesselTable';
import WorkOrderTable from './components/WorkOrderTable';
import ProjectTable from './components/ProjectTable';
import DisciplineTable from './components/DisciplineTable';
import StaffTable from './components/StaffTable';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app" style={{ display: 'flex' }}>
        <Sidebar />
        <div className="content" style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/clients" element={<ClientsTable />} />
            <Route path="/timesheets" element={<TimesheetTable />} />
            <Route path="/vessels" element={<VesselTable />} />
            <Route path="/workorders" element={<WorkOrderTable />} />
            <Route path="/projects" element={<ProjectTable />} />
            <Route path="/disciplines" element={<DisciplineTable />} />
            <Route path="/staff" element={<StaffTable />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
