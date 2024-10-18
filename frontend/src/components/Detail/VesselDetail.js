import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Select } from 'antd';
import { getVesselById, createVessel, updateVessel, deleteVessel } from '../../services/Vesselapi';
import { getClientDropdownList } from '../../services/Clientapi';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectTable from '../List/ProjectTable';

const { Text } = Typography;
const { Option } = Select;

const VesselDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [vesselData, setVesselData] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClientData();
    if (id && id !== 'new') {
      fetchVesselData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchVesselData = async (id) => {
    try {
      setLoading(true);
      const data = await getVesselById(id);
      setVesselData(data.data);
      form.setFieldsValue({
        Name: data.Name,
        Num: data.Num,
        ClientID: data.ClientID
      });
    } catch (error) {
      console.error('Error fetching vessel:', error);
      message.error(`Error fetching vessel data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientData = async () => {
    try {
      const clientData = await getClientDropdownList();
      setClients(clientData.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error(`Error fetching client data: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedVessel;
      if (id === 'new') {
        savedVessel = await createVessel(values);
        message.success('Vessel created successfully');
      } else {
        savedVessel = await updateVessel(id, values);
        message.success('Vessel updated successfully');
      }
      setEditMode(false);
      setVesselData(savedVessel);
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
      await deleteVessel(id);
      message.success('Vessel deleted successfully');
      navigate('/vessels');
    } catch (error) {
      console.error('Error deleting vessel:', error);
      message.error(`Error deleting vessel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/vessels');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(vesselData);
    }
  };

  return (
    <div>
      <h2>Vessel Details</h2>
      {!editMode && vesselData ? (
        <div>
          <p><Text strong>Name:</Text> {vesselData.Name}</p>
          <p><Text strong>Number:</Text> {vesselData.Num}</p>
          <p><Text strong>Client:</Text> {clients.find(c => c.id === vesselData.ClientID)?.Name}</p>
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
            rules={[{ required: true, message: 'Please input the vessel name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Num"
            label="Number"
            rules={[{ required: true, message: 'Please input the vessel number!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="ClientID"
            label="Client"
            rules={[{ required: true, message: 'Please select a client!' }]}
          >
            <Select>
              {clients.map(client => (
                <Option key={client.id} value={client.id}>
                  {client.name}
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
          <ProjectTable vesselId={id} />
        </>
      )}
    </div>
  );
};

export default VesselDetail;
