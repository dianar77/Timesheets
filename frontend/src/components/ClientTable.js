import React, { useState, useEffect } from 'react';
import Sidebar from './List/Sidebar';
import { getClients } from '../services/api';
import './ClientTable.css';

const ClientTable = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <div className="table-container">
          <h2>Client List</h2>
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.contactPerson}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
