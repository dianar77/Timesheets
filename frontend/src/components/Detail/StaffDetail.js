import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Select } from 'antd';
import { getStaffById, createStaff, updateStaff, deleteStaff } from '../../services/Staffapi';
import { getDisciplinesDropdownList } from '../../services/Disciplineapi';
import TimesheetTable from '../List/TimesheetTable';

const { Text } = Typography;
const { Option } = Select;

const StaffDetail = ({ staffId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [staffData, setStaffData] = useState(null);
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    fetchDisciplines();
    if (staffId && staffId !== 'new') {
      fetchStaffData(staffId);
    } else if (staffId === 'new') {
      setEditMode(true);
    }
  }, [staffId]);

  const fetchStaffData = async (id) => {
    try {
      setLoading(true);
      const data = await getStaffById(id);
      setStaffData(data);
      form.setFieldsValue({
        Name: data.Name,
        PersonalID: data.PersonalID,
        DisciplineID: data.DisciplineID
      });
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error(`Error fetching staff data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const disciplinesData = await getDisciplinesDropdownList();
      setDisciplines(disciplinesData.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      message.error(`Error fetching disciplines: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedStaff;
      if (staffId === 'new') {
        savedStaff = await createStaff(values);
        message.success('Staff created successfully');
      } else {
        savedStaff = await updateStaff(staffId, values);
        message.success('Staff updated successfully');
      }
      setEditMode(false);
      setStaffData(savedStaff);
    } catch (error) {
      console.error('Error saving staff:', error);
      message.error(`Error saving staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteStaff(staffId);
      message.success('Staff deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting staff:', error);
      message.error(`Error deleting staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(staffData);
    }
  };

  return (
    <div>
      <h2>Staff Details</h2>
      {!editMode && staffData ? (
        <div>
          <p><Text strong>Name:</Text> {staffData.Name}</p>
          <p><Text strong>Personal ID:</Text> {staffData.PersonalID}</p>
          <p><Text strong>Discipline:</Text> {disciplines.find(d => d.DisciplineID === staffData.DisciplineID)?.Name}</p>
          <Button onClick={toggleEditMode} type="primary" style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={handleDelete} danger style={{ marginRight: 8 }}>
            Delete
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      ) : (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="Name"
            label="Name"
            rules={[{ required: true, message: 'Please input the staff name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="PersonalID"
            label="Personal ID"
            rules={[{ required: true, message: 'Please input the personal ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="DisciplineID"
            label="Discipline"
            rules={[{ required: true, message: 'Please select a discipline!' }]}
          >
            <Select>
              {disciplines.map(discipline => (
                <Option key={discipline.DisciplineID} value={discipline.DisciplineID}>
                  {discipline.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Save
            </Button>
            {staffId !== 'new' && (
              <Button onClick={toggleEditMode} style={{ marginRight: 8 }}>
                Cancel
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </Form.Item>
        </Form>
      )}
      
      {staffId && staffId !== 'new' && (
        <>
          <Divider />
          <TimesheetTable staffId={staffId} />
        </>
      )}
    </div>
  );
};

export default StaffDetail;
