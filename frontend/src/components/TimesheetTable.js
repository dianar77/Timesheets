import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, DatePicker, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getTimesheets, updateTimesheet, deleteTimesheet, createTimesheet, getStaff, getWorkOrders } from '../services/api';
import moment from 'moment';
import './TimesheetTable.css';

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  staff,
  workOrders,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case 'number':
      inputNode = <InputNumber />;
      break;
    case 'date':
      inputNode = <DatePicker />;
      break;
    case 'select':
      if (dataIndex === 'StaffID') {
        inputNode = (
          <Select>
            {staff.map(s => (
              <Option key={s.StaffID} value={s.StaffID}>{s.Name}</Option>
            ))}
          </Select>
        );
      } else if (dataIndex === 'WorkOrderID') {
        inputNode = (
          <Select>
            {workOrders.map(wo => (
              <Option key={wo.WorkOrderID} value={wo.WorkOrderID}>{`${wo.Task} - ${wo.Description}`}</Option>
            ))}
          </Select>
        );
      }
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

const TimesheetTable = () => {
  const [form] = Form.useForm();
  const [timesheets, setTimesheets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheets();
    fetchStaff();
    fetchWorkOrders();
  }, []);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const data = await getTimesheets();
      console.log('Timesheet data in component:', data);
      if (Array.isArray(data)) {
        setTimesheets(data);
      } else if (data && typeof data === 'object') {
        const timesheetArray = data.timesheets || Object.values(data).find(Array.isArray);
        if (timesheetArray) {
          setTimesheets(timesheetArray);
        } else {
          throw new Error('No timesheet array found in the response');
        }
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      message.error(`Error fetching timesheets: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const staffData = await getStaff();
      console.log('Staff data received:', staffData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      message.error(`Error fetching staff data: ${error.message}`);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const workOrderData = await getWorkOrders();
      console.log('Work Order data received:', workOrderData);
      setWorkOrders(workOrderData);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      message.error(`Error fetching work order data: ${error.message}`);
    }
  };

  const isEditing = (record) => record.TimesheetID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ 
      ...record, 
      Date: moment(record.Date) // Ensure Date is a moment object
    });
    setEditingKey(record.TimesheetID);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...timesheets];
      const index = newData.findIndex((item) => key === item.TimesheetID);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = { 
          ...item, 
          ...row, 
          Date: row.Date.format('YYYY-MM-DD') 
        };
        await updateTimesheet(key, updatedItem);
        newData.splice(index, 1, updatedItem);
        setTimesheets(newData);
        setEditingKey('');
      } else {
        throw new Error('Timesheet not found');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteTimesheet(key);
      const newData = timesheets.filter((item) => item.TimesheetID !== key);
      setTimesheets(newData);
      message.success('Timesheet deleted successfully');
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      message.error('Error deleting timesheet: ' + error.message);
    }
  };

  const handleAdd = async () => {
    const newTimesheet = {
      StaffID: null,  // You might want to set a default value or leave it null
      WorkOrderID: null,  // You might want to set a default value or leave it null
      Date: moment().format('YYYY-MM-DD'),
      Hours: 0,
    };
    try {
      const addedTimesheet = await createTimesheet(newTimesheet);
      setTimesheets([addedTimesheet, ...timesheets]);
      message.success('New timesheet added successfully');
    } catch (error) {
      console.error('Error adding timesheet:', error);
      message.error('Error adding timesheet');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'TimesheetID',
      key: 'TimesheetID',
      editable: false,
    },
    {
      title: 'Staff',
      dataIndex: 'StaffID',
      key: 'StaffID',
      editable: true,
      render: (staffId) => {
        const staffMember = staff.find(s => s.StaffID === staffId);
        return staffMember ? staffMember.Name : 'Unknown';
      },
    },
    {
      title: 'Work Order',
      dataIndex: 'WorkOrderID',
      key: 'WorkOrderID',
      editable: true,
      render: (workOrderId) => {
        const workOrder = workOrders.find(wo => wo.WorkOrderID === workOrderId);
        return workOrder ? `${workOrder.Task} - ${workOrder.Description}` : 'Unknown';
      },
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      editable: true,
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Hours',
      dataIndex: 'Hours',
      key: 'Hours',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.TimesheetID)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.TimesheetID)}>
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
        inputType: col.dataIndex === 'Date' ? 'date' : 
                   col.dataIndex === 'Hours' ? 'number' : 
                   col.dataIndex === 'StaffID' || col.dataIndex === 'WorkOrderID' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        staff: staff,
        workOrders: workOrders,
      }),
    };
  });

  useEffect(() => {
    console.log('Editing key changed:', editingKey);
  }, [editingKey]);

  return (
    <div>
      <h2>Timesheet Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Timesheet
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
          dataSource={timesheets}
          rowKey={(record) => record.TimesheetID} // Use TimesheetID as the key
          bordered
          style={{ background: 'white' }}
        />
      </Form>
    </div>
  );
};

export default TimesheetTable;
