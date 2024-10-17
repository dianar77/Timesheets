import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchVessels, createVessel, updateVessel, deleteVessel, getClients } from '../services/api';
import './VesselTable.css';

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  clients,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case 'number':
      inputNode = <InputNumber />;
      break;
    case 'select':
      inputNode = (
        <Select>
          {clients.map(client => (
            <Option key={client.ClientID} value={client.ClientID}>{client.Name}</Option>
          ))}
        </Select>
      );
      break;
    default:
      inputNode = <Input />;
  }
  
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const VesselTable = () => {
  const [form] = Form.useForm();
  const [vessels, setVessels] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newVessel, setNewVessel] = useState(null);

  useEffect(() => {
    fetchVesselData();
    fetchClientData();
  }, []);

  useEffect(() => {
    if (editingKey === '') {
      fetchVesselData();
    }
  }, [editingKey]);

  const fetchVesselData = async () => {
    try {
      setLoading(true);
      const data = await fetchVessels();
      if (Array.isArray(data)) {
        setVessels(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching vessels:', error);
      message.error(`Error fetching vessels: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientData = async () => {
    try {
      const clientData = await getClients();
      setClients(clientData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error(`Error fetching client data: ${error.message}`);
    }
  };

  const isEditing = (record) => record.VesselID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      Name: record.Name,
      Num: record.Num,
      ClientID: record.ClientID
    });
    setEditingKey(record.VesselID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newVessel) {
      setNewVessel(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedVessel;
      
      if (key === 'new') {
        updatedVessel = await createVessel(row);
        setVessels(prev => [updatedVessel, ...prev]);
        setNewVessel(null);
      } else {
        const updatedItem = { 
          ...row, 
          VesselID: key,
          ClientID: Number(row.ClientID),
          Num: Number(row.Num)
        };
        updatedVessel = await updateVessel(key, updatedItem);
        setVessels(prev => prev.map(item => 
          item.VesselID === key ? updatedVessel : item
        ));
      }
      
      setEditingKey('');
      message.success('Vessel saved successfully');
      setVessels(prev => [...prev]);
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteVessel(key);
      const newData = vessels.filter((item) => item.VesselID !== key);
      setVessels(newData);
      message.success('Vessel deleted successfully');
    } catch (error) {
      console.error('Error deleting vessel:', error);
      message.error('Error deleting vessel: ' + error.message);
    }
  };

  const handleAdd = () => {
    const newVesselData = {
      VesselID: 'new',
      Name: '',
      Num: null,
      ClientID: null,
    };
    setNewVessel(newVesselData);
    setEditingKey('new');
    form.setFieldsValue(newVesselData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'VesselID',
      key: 'VesselID',
      editable: false,
      hidden: true
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      editable: true,
    },
    {
      title: 'Number',
      dataIndex: 'Num',
      key: 'Num',
      editable: true,
    },
    {
      title: 'Client',
      dataIndex: 'ClientID',
      key: 'ClientID',
      editable: true,
      render: (clientId) => {
        const client = clients.find(c => c.ClientID === clientId);
        return client ? client.Name : 'Unknown';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.VesselID)}
              style={{ marginRight: 8 }}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button icon={<CloseOutlined />}>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.VesselID)}>
              <Button icon={<DeleteOutlined />} type="danger">
                Delete
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'ClientID' ? 'select' : 
                   col.dataIndex === 'Num' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        clients: clients,
      }),
    };
  }).filter(col => !col.hidden);

  return (
    <div>
      <h2>Vessel Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Vessel
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          loading={loading}
          columns={mergedColumns}
          dataSource={newVessel ? [newVessel, ...vessels] : vessels}
          rowKey={(record) => record.VesselID}
          bordered
          style={{ background: 'white' }}
        />
      </Form>
    </div>
  );
};

export default VesselTable;
