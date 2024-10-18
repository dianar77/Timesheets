import React, { useState, useEffect } from 'react';
import ClientTable from './List/ClientTable';
import { fetchClients } from '../services/api';

const ClientTableContainer = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const getClients = async () => {
      try {
        const fetchedClients = await fetchClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    getClients();
  }, []);

  return <ClientTable clients={clients} />;
};

export default ClientTableContainer;
