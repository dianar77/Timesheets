import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { getVessels, createVessel, updateVessel, deleteVessel, getClients } from '../../services/api';

const { Option } = Select;

const VesselDetail = ({ vesselId, onSave, onDelete, onCancel }) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientData();
    if (vesselId && vesselId !== 'new') {
      fetchVesselData(vesselId);
    }
  }, [vesselId]);

  const fetchClientData = async () => {
    try {
      const clientData = await getClients();
      setClients(clientData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error(`Error fetching client data: ${error.message}`);
    }
  };

  const fetchVesselData = async (id) => {
    try {
      setLoading(true);
      const vesselData = await getVessels(id);
      form.setFieldsValue(vesselData);
    } catch (error) {
      console.error('Error fetching vessel:', error);
      message.error(`Error fetching vessel data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedVessel;
      if (vesselId === 'new') {
        savedVessel = await createVessel(values);
        message.success('Vessel created successfully');
      } else {
        savedVessel = await updateVessel(vesselId, values);
        message.success('Vessel updated successfully');
      }
      onSave(savedVessel);
    } catch (error) {
      console.error('Error saving vessel:', error);
      message.error(`Error saving vessel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteVessel(vesselId);
      message.success('Vessel deleted successfully');
      onDelete(vesselId);
    } catch (error) {
      console.error('Error deleting vessel:', error);
      message.error(`Error deleting vessel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="Name" label="Name" rules={[{ required: true, message: 'Please input the vessel name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Num" label="Number" rules={[{ required: true, message: 'Please input the vessel number!' }]}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="ClientID" label="Client" rules={[{ required: true, message: 'Please select a client!' }]}>
        <Select>
          {clients.map(client => (
            <Option key={client.ClientID} value={client.ClientID}>{client.Name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          Save
        </Button>
        {vesselId !== 'new' && (
          <Button danger onClick={handleDelete} loading={loading} style={{ marginRight: 8 }}>
            Delete
          </Button>
        )}
        <Button onClick={onCancel}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default VesselDetail;
