import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getProjects, updateProject, deleteProject, createProject } from '../../services/Projectapi';
import { getVesselDropdownList } from '../../services/Vesselapi';
import './ProjectTable.css';

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  vessels,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case 'number':
      inputNode = <Input type="number" />;
      break;
    case 'select':
      inputNode = (
        <Select>
          {vessels.map(v => (
            <Option key={v.id} value={v.id}>{v.name}</Option>
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

const ProjectTable = () => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchVessels();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error(`Error fetching projects: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchVessels = async () => {
    try {
      const vesselData = await getVesselDropdownList();
      setVessels(vesselData.data);
    } catch (error) {
      console.error('Error fetching vessels:', error);
      message.error(`Error fetching vessel data: ${error.message}`);
    }
  };

  const isEditing = (record) => record.ProjectID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.ProjectID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newProject) {
      setNewProject(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedProject;
      
      if (key === 'new') {
        updatedProject = await createProject(row);
        setProjects(prev => [updatedProject, ...prev]);
        setNewProject(null);
      } else {
        const updatedItem = { ...row, ProjectID: key };
        updatedProject = await updateProject(key, updatedItem);
        setProjects(prev => prev.map(item => 
          item.ProjectID === key ? updatedProject : item
        ));
      }
      
      setEditingKey('');
      message.success('Project saved successfully');
      setProjects(prev => [...prev]);
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Failed to save: ' + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteProject(key);
      const newData = projects.filter((item) => item.ProjectID !== key);
      setProjects(newData);
      message.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Error deleting project: ' + error.message);
    }
  };

  const handleAdd = () => {
    const newProjectData = {
      ProjectID: 'new',
      Name: '',
      Num: null,
      VesselID: null,
    };
    setNewProject(newProjectData);
    setEditingKey('new');
    form.setFieldsValue(newProjectData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ProjectID',
      key: 'ProjectID',
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
      title: 'Num',
      dataIndex: 'Num',
      key: 'Num',
      editable: true,
    },
    {
      title: 'Vessel',
      dataIndex: 'VesselID',
      key: 'VesselID',
      editable: true,
      render: (vesselId) => {
        const vessel = vessels.find(v => v.id === vesselId);
        return vessel ? vessel.name : 'Unknown';
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
              onClick={() => save(record.ProjectID)}
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.ProjectID)}>
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
        inputType: col.dataIndex === 'VesselID' ? 'select' : col.dataIndex === 'Num' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        vessels: vessels,
      }),
    };
  }).filter(col => !col.hidden);

  return (
    <div className="project-table">
      <h2>Project Table</h2>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Project
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
          dataSource={newProject ? [newProject, ...projects] : projects}
          rowKey={(record) => record.ProjectID}
          bordered
        />
      </Form>
    </div>
  );
};

export default ProjectTable;
