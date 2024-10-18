import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Typography } from 'antd';
import { getDiscipline, createDiscipline, updateDiscipline, deleteDiscipline } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const DisciplineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [disciplineData, setDisciplineData] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchDisciplineData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchDisciplineData = async (id) => {
    try {
      setLoading(true);
      const data = await getDiscipline(id);
      setDisciplineData(data);
      form.setFieldsValue({
        Name: data.Name,
        Rate: data.Rate
      });
    } catch (error) {
      console.error('Error fetching discipline:', error);
      message.error(`Error fetching discipline data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedDiscipline;
      if (id === 'new') {
        savedDiscipline = await createDiscipline(values);
        message.success('Discipline created successfully');
      } else {
        savedDiscipline = await updateDiscipline(id, values);
        message.success('Discipline updated successfully');
      }
      setEditMode(false);
      setDisciplineData(savedDiscipline);
    } catch (error) {
      console.error('Error saving discipline:', error);
      message.error(`Error saving discipline: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteDiscipline(id);
      message.success('Discipline deleted successfully');
      navigate('/disciplines');
    } catch (error) {
      console.error('Error deleting discipline:', error);
      message.error(`Error deleting discipline: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/disciplines');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(disciplineData);
    }
  };

  return (
    <div>
      <h2>Discipline Details</h2>
      {!editMode && disciplineData ? (
        <div>
          <p><Text strong>Name:</Text> {disciplineData.Name}</p>
          <p><Text strong>Rate:</Text> {disciplineData.Rate}</p>
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
            rules={[{ required: true, message: 'Please input the discipline name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Rate"
            label="Rate"
            rules={[{ required: true, message: 'Please input the discipline rate!' }]}
          >
            <InputNumber min={0} step={0.01} precision={2} />
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
    </div>
  );
};

export default DisciplineDetail;
