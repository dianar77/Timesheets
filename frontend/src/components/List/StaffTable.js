import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getStaff, updateStaff, deleteStaff, createStaff, getDisciplines } from '../../services/api';
import './StaffTable.css';

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  disciplines,
  ...restProps
}) => {
  const inputNode = inputType === 'select' ? (
    <Select>
      {disciplines.map(d => (
        <Option key={d.DisciplineID} value={d.DisciplineID}>{d.Name}</Option>
      ))}
    </Select>
  ) : <Input />;
  
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

const StaffTable = () => {
  const [form] = Form.useForm();
  const [staff, setStaff] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
    fetchDisciplines();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaff();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const disciplineData = await getDisciplines();
      setDisciplines(disciplineData);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      message.error(`Error fetching discipline data: ${error.message}`);
    }
  };

  const isEditing = (record) => record.StaffID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.StaffID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newStaff) {
      setNewStaff(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedStaff;
      
      if (key === 'new') {
        updatedStaff = await createStaff(row);
        setStaff(prev => [updatedStaff, ...prev]);
        setNewStaff(null);
      } else {
        updatedStaff = await updateStaff(key, row);
        setStaff(prev => prev.map(item => 
          item.StaffID === key ? updatedStaff : item
        ));
      }
      
      setEditingKey('');
      message.success('Staff saved successfully');
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteStaff(key);
      setStaff(prev => prev.filter(item => item.StaffID !== key));
      message.success('Staff deleted successfully');
    } catch (error) {
      console.error('Error deleting staff:', error);
      message.error('Error deleting staff: ' + error.message);
    }
  };

  const handleAdd = () => {
    const newStaffData = {
      StaffID: 'new',
      Name: '',
      PersonalID: '',
      DisciplineID: null,
    };
    setNewStaff(newStaffData);
    setEditingKey('new');
    form.setFieldsValue(newStaffData);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      editable: true,
      hidden: true,
    },
    {
      title: 'Personal ID',
      dataIndex: 'PersonalID',
      key: 'PersonalID',
      editable: true,
    },
    {
      title: 'Discipline',
      dataIndex: 'DisciplineID',
      key: 'DisciplineID',
      editable: true,
      render: (disciplineId) => {
        const discipline = disciplines.find(d => d.DisciplineID === disciplineId);
        return discipline ? discipline.Name : 'Unknown';
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
              onClick={() => save(record.StaffID)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.StaffID)}>
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
        inputType: col.dataIndex === 'DisciplineID' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        disciplines: disciplines,
      }),
    };
  }).filter(col => !col.hidden);

  return (
    <div className="staff-table">
      <h2>Staff Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Staff
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
          dataSource={newStaff ? [newStaff, ...staff] : staff}
          rowKey={(record) => record.StaffID}
          bordered
        />
      </Form>
    </div>
  );
};

export default StaffTable;
