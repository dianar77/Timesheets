import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getClients, createClient, updateClient, deleteClient } from '../services/api';
import './ClientsTable.css';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  
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

const ClientsTable = () => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
  });
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (editingKey === '') {
      fetchClients();
    }
  }, [editingKey]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      if (Array.isArray(data)) {
        setClients(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error(`Error fetching clients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.ClientID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      Name: record.Name,
    });
    setEditingKey(record.ClientID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newClient) {
      setNewClient(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedClient;
      
      if (key === 'new') {
        updatedClient = await createClient(row);
        setClients(prev => [updatedClient, ...prev]);
        setNewClient(null);
      } else {
        const updatedItem = { 
          ...row, 
          ClientID: key,
        };
        updatedClient = await updateClient(key, updatedItem);
        setClients(prev => prev.map(item => 
          item.ClientID === key ? updatedClient : item
        ));
      }
      
      setEditingKey('');
      message.success('Client saved successfully');
      setClients(prev => [...prev]);
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteClient(key);
      const newData = clients.filter((item) => item.ClientID !== key);
      setClients(newData);
      message.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error('Error deleting client: ' + error.message);
    }
  };

  const handleAdd = () => {
    const newClientData = {
      ClientID: 'new',
      Name: '',
    };
    setNewClient(newClientData);
    setEditingKey('new');
    form.setFieldsValue(newClientData);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const filteredClients = clients.filter(client => {
    return client.Name.toLowerCase().includes(filters.name.toLowerCase());
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
      <th></th> {/* Empty cell for Actions column */}
    </tr>
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ClientID',
      key: 'ClientID',
      editable: false,
      hidden: true
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
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.ClientID)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.ClientID)}>
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
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  }).filter(col => !col.hidden);

  return (
    <div>
      <h2>Clients Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Client
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
          dataSource={newClient ? [newClient, ...filteredClients] : filteredClients}
          rowKey={(record) => record.ClientID}
          bordered
          style={{ background: 'white' }}
          onChange={handleChange}
        />
      </Form>
    </div>
  );
};

export default ClientsTable;
