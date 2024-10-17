import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TimesheetTable from './components/TimesheetTable';
import VesselTable from './components/VesselTable';

import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('timesheets');

  return (
    <div className="App">
      <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="main-content">
        {activeComponent === 'timesheets' && <TimesheetTable />}
        {activeComponent === 'vessels' && <VesselTable />}

      </div>
    </div>
  );
}

export default App;
