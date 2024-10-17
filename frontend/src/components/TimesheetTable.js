import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, DatePicker, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getTimesheets, updateTimesheet, deleteTimesheet, createTimesheet } from '../services/api';
import moment from 'moment';
import './TimesheetTable.css';

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
  const inputNode = inputType === 'number' ? <InputNumber /> : inputType === 'date' ? <DatePicker /> : <Input />;
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
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const data = await getTimesheets();
      console.log('Raw data from API:', data);
      console.log('Data type:', typeof data);
      console.log('Is Array:', Array.isArray(data));
      if (Array.isArray(data)) {
        setTimesheets(data);
      } else if (data && typeof data === 'object') {
        console.log('Object keys:', Object.keys(data));
        if (data.timesheets && Array.isArray(data.timesheets)) {
          setTimesheets(data.timesheets);
        } else {
          // Try to find any array in the response
          const arrayData = Object.values(data).find(Array.isArray);
          if (arrayData) {
            setTimesheets(arrayData);
          } else {
            throw new Error('No array found in the response');
          }
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

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record, date: moment(record.date) });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...timesheets];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = { ...item, ...row, date: row.date.format('YYYY-MM-DD') };
        await updateTimesheet(key, updatedItem);
        newData.splice(index, 1, updatedItem);
        setTimesheets(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteTimesheet(key);
      const newData = timesheets.filter((item) => item.id !== key);
      setTimesheets(newData);
      message.success('Timesheet deleted successfully');
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      message.error('Error deleting timesheet');
    }
  };

  const handleAdd = async () => {
    const newTimesheet = {
      date: moment().format('YYYY-MM-DD'),
      hours: 0,
      description: '',
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
              onClick={() => save(record.id)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
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
        inputType: col.dataIndex === 'date' ? 'date' : col.dataIndex === 'hours' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
          rowKey={(record) => record.id}
          bordered
          style={{ background: 'white' }}
        />
      </Form>
    </div>
  );
};

export default TimesheetTable;
