import React from 'react';
import './Sidebar.css';

function Sidebar({ activeComponent, setActiveComponent }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-button ${activeComponent === 'vessels' ? 'active' : ''}`}
          onClick={() => setActiveComponent('vessels')}
        >
          Vessels
        </button>
        <button
          className={`sidebar-button ${activeComponent === 'timesheets' ? 'active' : ''}`}
          onClick={() => setActiveComponent('timesheets')}
        >
          Timesheets
        </button>
        <button
          className={`sidebar-button ${activeComponent === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveComponent('clients')}
        >
          Clients
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
