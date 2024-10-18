import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getWorkOrders, updateWorkOrder, deleteWorkOrder, createWorkOrder } from '../../services/WorkOrderapi';
import { getProjectDropdownList } from '../../services/Projectapi';
import './WorkOrderTable.css';

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  projects,
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
          {projects.map(p => (
            <Option key={p.ProjectID} value={p.ProjectID}>{p.Name}</Option>
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

const WorkOrderTable = () => {
  const [form] = Form.useForm();
  const [workOrders, setWorkOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newWorkOrder, setNewWorkOrder] = useState(null);

  useEffect(() => {
    fetchWorkOrders();
    fetchProjects();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const data = await getWorkOrders();
      setWorkOrders(data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      message.error(`Error fetching work orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectData = await getProjectDropdownList();
      setProjects(projectData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error(`Error fetching project data: ${error.message}`);
    }
  };

  const isEditing = (record) => record.WorkOrderID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.WorkOrderID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newWorkOrder) {
      setNewWorkOrder(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedWorkOrder;
      
      if (key === 'new') {
        updatedWorkOrder = await createWorkOrder(row);
        setWorkOrders(prev => [updatedWorkOrder, ...prev]);
        setNewWorkOrder(null);
      } else {
        const updatedItem = { ...row, WorkOrderID: key };
        updatedWorkOrder = await updateWorkOrder(key, updatedItem);
        setWorkOrders(prev => prev.map(item => 
          item.WorkOrderID === key ? updatedWorkOrder : item
        ));
      }
      
      setEditingKey('');
      message.success('Work Order saved successfully');
      setWorkOrders(prev => [...prev]);
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteWorkOrder(key);
      const newData = workOrders.filter((item) => item.WorkOrderID !== key);
      setWorkOrders(newData);
      message.success('Work Order deleted successfully');
    } catch (error) {
      console.error('Error deleting work order:', error);
      message.error('Error deleting work order: ' + error.message);
    }
  };

  const handleAdd = () => {
    const newWorkOrderData = {
      WorkOrderID: 'new',
      Task: null,
      Description: '',
      ProjectID: null,
    };
    setNewWorkOrder(newWorkOrderData);
    setEditingKey('new');
    form.setFieldsValue(newWorkOrderData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'WorkOrderID',
      key: 'WorkOrderID',
      editable: false,
      hidden: true
    },
    {
      title: 'Task #',
      dataIndex: 'Task',
      key: 'Task',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
      editable: true,
    },
    {
      title: 'Project',
      dataIndex: 'ProjectID',
      key: 'ProjectID',
      editable: true,
      render: (projectId) => {
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : 'Unknown';
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
              onClick={() => save(record.WorkOrderID)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.WorkOrderID)}>
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
        inputType: col.dataIndex === 'ProjectID' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        projects: projects,
      }),
    };
  }).filter(col => !col.hidden);

  return (
    <div className="work-order-table">
      <h2>Work Order Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Work Order
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
          dataSource={newWorkOrder ? [newWorkOrder, ...workOrders] : workOrders}
          rowKey={(record) => record.WorkOrderID}
          bordered
        />
      </Form>
    </div>
  );
};

export default WorkOrderTable;
