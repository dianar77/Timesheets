import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { getStaffByDiscipline } from '../../services/api';

const FilteredStaffTable = ({ disciplineId }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [disciplineId]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const staffData = await getStaffByDiscipline(disciplineId);
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={staff}
      rowKey="StaffID"
      loading={loading}
    />
  );
};

export default FilteredStaffTable;
