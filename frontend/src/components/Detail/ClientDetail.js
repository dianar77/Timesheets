import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider } from 'antd';
import { getClientById, createClient, updateClient, deleteClient } from '../../services/Clientapi';
import { useParams, useNavigate } from 'react-router-dom';
import VesselTable from '../List/VesselTable';

const { Text } = Typography;

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchClientData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchClientData = async (id) => {
    try {
      setLoading(true);
      const data = await getClientById(id);
      setClientData(data.data);
      form.setFieldsValue({
        Name: data.Name,
        ContactPerson: data.ContactPerson,
        Email: data.Email,
        Phone: data.Phone
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      message.error(`Error fetching client data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedClient;
      if (id === 'new') {
        savedClient = await createClient(values);
        message.success('Client created successfully');
      } else {
        savedClient = await updateClient(id, values);
        message.success('Client updated successfully');
      }
      setEditMode(false);
      setClientData(savedClient);
    } catch (error) {
      console.error('Error saving client:', error);
      message.error(`Error saving client: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteClient(id);
      message.success('Client deleted successfully');
      navigate('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error(`Error deleting client: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/clients');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(clientData);
    }
  };

  return (
    <div>
      <h2>Client Details</h2>
      {!editMode && clientData ? (
        <div>
          <p><Text strong>Name:</Text> {clientData.Name}</p>
          <p><Text strong>Contact Person:</Text> {clientData.ContactPerson}</p>
          <p><Text strong>Email:</Text> {clientData.Email}</p>
          <p><Text strong>Phone:</Text> {clientData.Phone}</p>
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
            rules={[{ required: true, message: 'Please input the client name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ContactPerson"
            label="Contact Person"
            rules={[{ required: true, message: 'Please input the contact person!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email address!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
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
          <h3>Client's Vessels</h3>
          <VesselTable clientId={id} />
        </>
      )}
    </div>
  );
};

export default ClientDetail;
