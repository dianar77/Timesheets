import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getDisciplines, updateDiscipline, deleteDiscipline, createDiscipline } from '../../services/api';
import './DisciplineTable.css';

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

const DisciplineTable = () => {
  const [form] = Form.useForm();
  const [disciplines, setDisciplines] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newDiscipline, setNewDiscipline] = useState(null);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      setLoading(true);
      const data = await getDisciplines();
      setDisciplines(data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      message.error(`Error fetching disciplines: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.DisciplineID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.DisciplineID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newDiscipline) {
      setNewDiscipline(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedDiscipline;
      
      if (key === 'new') {
        updatedDiscipline = await createDiscipline(row);
        setDisciplines(prev => [updatedDiscipline, ...prev]);
        setNewDiscipline(null);
      } else {
        updatedDiscipline = await updateDiscipline(key, row);
        setDisciplines(prev => prev.map(item => 
          item.DisciplineID === key ? updatedDiscipline : item
        ));
      }
      
      setEditingKey('');
      message.success('Discipline saved successfully');
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteDiscipline(key);
      setDisciplines(prev => prev.filter(item => item.DisciplineID !== key));
      message.success('Discipline deleted successfully');
    } catch (error) {
      console.error('Error deleting discipline:', error);
      message.error('Error deleting discipline: ' + error.message);
    }
  };

  const handleAdd = () => {
    const newDisciplineData = {
      DisciplineID: 'new',
      Name: '',
      Rate: 0,
    };
    setNewDiscipline(newDisciplineData);
    setEditingKey('new');
    form.setFieldsValue(newDisciplineData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'DisciplineID',
      key: 'DisciplineID',
      editable: false,
      hidden: true,
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      editable: true,
    },
    {
      title: 'Rate',
      dataIndex: 'Rate',
      key: 'Rate',
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
              onClick={() => save(record.DisciplineID)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.DisciplineID)}>
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
        inputType: col.dataIndex === 'Rate' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  }).filter(col => !col.hidden);

  return (
    <div className="discipline-table">
      <h2>Discipline Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Discipline
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
          dataSource={newDiscipline ? [newDiscipline, ...disciplines] : disciplines}
          rowKey={(record) => record.DisciplineID}
          bordered
        />
      </Form>
    </div>
  );
};

export default DisciplineTable;
