import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { getStaffs, getStaffByDiscipline, deleteStaff } from '../../services/Staffapi';
import { Link } from 'react-router-dom';
import './StaffTable.css';

const StaffTable = ({ disciplineId }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [disciplineId]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      let staffData = undefined;
      if (disciplineId === undefined) {
        staffData = await getStaffs(disciplineId);
      } else {
        staffData = await getStaffByDiscipline(disciplineId);
      }
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error('Failed to fetch staff list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStaff(id);
      message.success('Staff member deleted successfully');
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      message.error('Failed to delete staff member');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Personal ID',
      dataIndex: 'PersonalID',
      key: 'PersonalID',
    },
    {
      title: 'Discipline',
      dataIndex: 'DisciplineName',
      key: 'DisciplineName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Link to={`/staff/${record.StaffID}`}>
            <Button type="primary" style={{ marginRight: 8 }}>Edit</Button>
          </Link>
          <Button onClick={() => handleDelete(record.StaffID)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className="staff-table">
      <h2>Staff List</h2>
      <Link to="/staff/new">
        <Button type="primary" style={{ marginBottom: 16 }}>Add New Staff</Button>
      </Link>
      <Table
        columns={columns}
        dataSource={staff}
        rowKey="StaffID"
        loading={loading}
      />
    </div>
  );
};

export default StaffTable;
