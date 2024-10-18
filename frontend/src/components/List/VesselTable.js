import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getVessels, createVessel, updateVessel, deleteVessel } from '../../services/Vesselapi';
import { getClientDropdownList } from '../../services/Clientapi';
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
  const [filters, setFilters] = useState({
    name: '',
    number: '',
    client: null,
  });
  const [sortedInfo, setSortedInfo] = useState({});

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
      const data = await getVessels();
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
      const clientData = await getClientDropdownList();
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

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const filteredVessels = vessels.filter(vessel => {
    return (
      vessel.Name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.number === '' || vessel.Num.toString().includes(filters.number)) &&
      (!filters.client || vessel.ClientID === filters.client)
    );
  });

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setSortedInfo(sorter);
  };

  const FilterHeader = () => (
    <tr className="filter-row">
      <th>
        <Input
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
      </th>
      <th>
        <Input
          placeholder="Filter by Number"
          value={filters.number}
          onChange={(e) => handleFilterChange('number', e.target.value)}
        />
      </th>
      <th>
        <Select
          style={{ width: '100%' }}
          placeholder="Filter by Client"
          onChange={(value) => handleFilterChange('client', value)}
          allowClear
        >
          {clients.map(client => (
            <Option key={client.ClientID} value={client.ClientID}>{client.Name}</Option>
          ))}
        </Select>
      </th>
      <th></th> {/* Empty cell for Actions column */}
    </tr>
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'VesselID',
      key: 'VesselID',
      editable: false,
      hidden: true,
      sorter: (a, b) => a.VesselID - b.VesselID,
      sortOrder: sortedInfo.columnKey === 'VesselID' && sortedInfo.order,
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      editable: true,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      sortOrder: sortedInfo.columnKey === 'Name' && sortedInfo.order,
    },
    {
      title: 'Number',
      dataIndex: 'Num',
      key: 'Num',
      editable: true,
      sorter: (a, b) => a.Num - b.Num,
      sortOrder: sortedInfo.columnKey === 'Num' && sortedInfo.order,
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
      sorter: (a, b) => {
        const clientA = clients.find(c => c.ClientID === a.ClientID);
        const clientB = clients.find(c => c.ClientID === b.ClientID);
        return clientA.Name.localeCompare(clientB.Name);
      },
      sortOrder: sortedInfo.columnKey === 'ClientID' && sortedInfo.order,
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
            header: {
              wrapper: ({ children }) => (
                <thead>
                  <FilterHeader />
                  {children}
                </thead>
              ),
            },
          }}
          loading={loading}
          columns={mergedColumns}
          dataSource={newVessel ? [newVessel, ...filteredVessels] : filteredVessels}
          rowKey={(record) => record.VesselID}
          bordered
          style={{ background: 'white' }}
          onChange={handleChange}
        />
      </Form>
    </div>
  );
};

export default VesselTable;
