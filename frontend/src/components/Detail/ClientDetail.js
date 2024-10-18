import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { getClients, createClient, updateClient, deleteClient } from '../../services/Clientapi';

const ClientDetail = ({ clientId, onSave, onDelete, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientId && clientId !== 'new') {
      fetchClientData(clientId);
    }
  }, [clientId]);

  const fetchClientData = async (id) => {
    try {
      setLoading(true);
      const clientData = await getClients(id);
      form.setFieldsValue(clientData);
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
      if (clientId === 'new') {
        savedClient = await createClient(values);
        message.success('Client created successfully');
      } else {
        savedClient = await updateClient(clientId, values);
        message.success('Client updated successfully');
      }
      onSave(savedClient);
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
      await deleteClient(clientId);
      message.success('Client deleted successfully');
      onDelete(clientId);
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error(`Error deleting client: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="Name"
        label="Name"
        rules={[{ required: true, message: 'Please input the client name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          Save
        </Button>
        {clientId !== 'new' && (
          <Button danger onClick={handleDelete} loading={loading} style={{ marginRight: 8 }}>
            Delete
          </Button>
        )}
        <Button onClick={onCancel}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default ClientDetail;
