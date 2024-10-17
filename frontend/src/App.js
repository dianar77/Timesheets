import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TimesheetTable from './components/TimesheetTable';
import VesselTable from './components/VesselTable';
import ClientsTable from './components/ClientsTable';

import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('timesheets');

  return (
    <div className="App">
      <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="main-content">
        {activeComponent === 'timesheets' && <TimesheetTable />}
        {activeComponent === 'vessels' && <VesselTable />}
        {activeComponent === 'clients' && <ClientsTable />}
      </div>
    </div>
  );
}

export default App;
