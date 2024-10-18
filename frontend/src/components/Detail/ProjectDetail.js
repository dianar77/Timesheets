import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Select, DatePicker } from 'antd';
import { getProjectById, createProject, updateProject, deleteProject } from '../../services/Projectapi';
import { getVesselDropdownList } from '../../services/Vesselapi';
import { useParams, useNavigate } from 'react-router-dom';
import WorkOrderTable from '../List/WorkOrderTable';

const { Text } = Typography;
const { Option } = Select;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    fetchVesselData();
    if (id && id !== 'new') {
      fetchProjectData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchProjectData = async (id) => {
    try {
      setLoading(true);
      const data = await getProjectById(id);
      console.log('xxxppp', data);
      setProjectData(data.data);
      form.setFieldsValue({
        Name: data.Name,
        VesselID: data.VesselID,
        Num: data.Num,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      message.error(`Error fetching project data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchVesselData = async () => {
    try {
      const vesselData = await getVesselDropdownList();
      setVessels(vesselData.data);
    } catch (error) {
      console.error('Error fetching vessels:', error);
      message.error(`Error fetching vessel data: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedProject;
      if (id === 'new') {
        savedProject = await createProject(values);
        message.success('Project created successfully');
      } else {
        savedProject = await updateProject(id, values);
        message.success('Project updated successfully');
      }
      setEditMode(false);
      setProjectData(savedProject);
    } catch (error) {
      console.error('Error saving project:', error);
      message.error(`Error saving project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProject(id);
      message.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error(`Error deleting project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(projectData);
    }
  };

  return (
    <div>
      <h2>Project Details</h2>
      {!editMode && projectData ? (
        <div>
          <p><Text strong>Name:</Text> {projectData.Name}</p>
          <p><Text strong>Vessel:</Text> {vessels.find(c => c.id === projectData.VesselID)?.name}</p>
          <p><Text strong>Num:</Text> {projectData.Num}</p>
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
            rules={[{ required: true, message: 'Please input the project name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="VesselID"
            label="Vessel"
            rules={[{ required: true, message: 'Please select a vessel!' }]}
          >
            <Select>
              {vessels.map(vessel => (
                <Option key={vessel.id} value={vessel.id}>
                  {vessel.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Num"
            label="Num"
            rules={[{ required: true, message: 'Please input the Number!' }]}
          >
            <Input />
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
          <WorkOrderTable projectId={id} />
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
