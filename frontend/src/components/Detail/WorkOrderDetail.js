import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Select } from 'antd';
import { getWorkOrderById, createWorkOrder, updateWorkOrder, deleteWorkOrder } from '../../services/WorkOrderapi';
import { getProjectDropdownList } from '../../services/Projectapi';
import { useParams, useNavigate } from 'react-router-dom';
import TimesheetTable from '../List/TimesheetTable';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const WorkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [workOrderData, setWorkOrderData] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjectData();
    if (id && id !== 'new') {
      fetchWorkOrderData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchWorkOrderData = async (id) => {
    try {
      setLoading(true);
      const data = await getWorkOrderById(id);
      setWorkOrderData(data.data);
      form.setFieldsValue({
        Task: data.Task,
        Description: data.Description,
        ProjectID: data.ProjectID
      });
    } catch (error) {
      console.error('Error fetching work order:', error);
      message.error(`Error fetching work order data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectData = async () => {
    try {
      const projectData = await getProjectDropdownList();
      setProjects(projectData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error(`Error fetching project data: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedWorkOrder;
      if (id === 'new') {
        savedWorkOrder = await createWorkOrder(values);
        message.success('Work order created successfully');
      } else {
        savedWorkOrder = await updateWorkOrder(id, values);
        message.success('Work order updated successfully');
      }
      setEditMode(false);
      setWorkOrderData(savedWorkOrder);
    } catch (error) {
      console.error('Error saving work order:', error);
      message.error(`Error saving work order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteWorkOrder(id);
      message.success('Work order deleted successfully');
      navigate('/workorders');
    } catch (error) {
      console.error('Error deleting work order:', error);
      message.error(`Error deleting work order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/workorders');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(workOrderData);
    }
  };

  return (
    <div>
      <h2>Work Order Details</h2>
      {!editMode && workOrderData ? (
        <div>
          <p><Text strong>Task #:</Text> {workOrderData.Task}</p>
          <p><Text strong>Description:</Text> {workOrderData.Description}</p>
          <p><Text strong>Project:</Text> {projects.find(p => p.id === workOrderData.ProjectID)?.Name}</p>
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
            name="Task"
            label="Task #"
            rules={[{ required: true, message: 'Please input the task number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="ProjectID"
            label="Project"
            rules={[{ required: true, message: 'Please select a project!' }]}
          >
            <Select>
              {projects.map(project => (
                <Option key={project.id} value={project.id}>
                  {project.Name}
                </Option>
              ))}
            </Select>
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
          <TimesheetTable staffId={undefined} workOrderId={id} />
        </>
      )}
    </div>
  );
};

export default WorkOrderDetail;
