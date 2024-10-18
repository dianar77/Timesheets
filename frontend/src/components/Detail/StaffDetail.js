import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Select } from 'antd';
import { getStaffById, createStaff, updateStaff, deleteStaff } from '../../services/Staffapi';
import { getDisciplinesDropdownList } from '../../services/Disciplineapi';
import { useParams, useNavigate } from 'react-router-dom';
import TimesheetTable from '../List/TimesheetTable';

const { Text } = Typography;
const { Option } = Select;

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [staffData, setStaffData] = useState(null);
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    fetchDisciplineData();
    if (id && id !== 'new') {
      fetchStaffData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchStaffData = async (id) => {
    try {
      setLoading(true);
      const data = await getStaffById(id);
      setStaffData(data.data);
      form.setFieldsValue({
        Name: data.Name,
        Rate: data.Rate
      });
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error(`Error fetching staff data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplineData = async () => {
    try {
      const disciplineData = await getDisciplinesDropdownList();
      setDisciplines(disciplineData.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      message.error(`Error fetching discipline data: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedStaff;
      if (id === 'new') {
        savedStaff = await createStaff(values);
        message.success('Staff created successfully');
      } else {
        savedStaff = await updateStaff(id, values);
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
      await deleteStaff(id);
      message.success('Staff deleted successfully');
      navigate('/staffs');
    } catch (error) {
      console.error('Error deleting staff:', error);
      message.error(`Error deleting staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/staffs');
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
          <p><Text strong>Discipline:</Text> {disciplines.find(d => d.id === staffData.DisciplineID)?.Name}</p>
          <Button onClick={toggleEditMode} type="primary" style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={handleDelete} danger style={{ marginRight: 8 }}>
            Delete
          </Button>
          <Button onClick={handleBack}>Back to List</Button>
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
                <Option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Save
            </Button>
            {id !== 'new' && (
              <Button onClick={toggleEditMode} style={{ marginRight: 8 }}>
                Cancel
              </Button>
            )}
           <Button onClick={handleBack}>Back to List</Button>
          </Form.Item>
        </Form>
      )}
      
      {id && id !== 'new' && (
        <>
          <Divider />
          <TimesheetTable staffId={id} workOrderId={undefined} />
        </>
      )}
    </div>
  );
};

export default StaffDetail;
