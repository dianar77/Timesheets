import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider, Select, DatePicker } from 'antd';
import { getTimesheetById, createTimesheet, updateTimesheet, deleteTimesheet } from '../../services/Timesheetapi';
import { getStaffsDropdownList } from '../../services/Staffapi';
import { getWorkOrderDropdownList } from '../../services/WorkOrderapi';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Text } = Typography;
const { Option } = Select;

const TimesheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [timesheetData, setTimesheetData] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    fetchStaffData();
    fetchWorkOrderData();
    if (id && id !== 'new') {
      fetchTimesheetData(id);
    } else if (id === 'new') {
      setEditMode(true);
    }
  }, [id]);

  const fetchTimesheetData = async (id) => {
    try {
      setLoading(true);
      const data = await getTimesheetById(id);
      setTimesheetData(data);
      form.setFieldsValue({
        StaffID: data.StaffID,
        WorkOrderID: data.WorkOrderID,
        Date: moment(data.Date),
        Hours: data.Hours
      });
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      message.error(`Error fetching timesheet data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffData = async () => {
    try {
      const staffData = await getStaffsDropdownList();
      setStaffs(staffData.data);
    } catch (error) {
      console.error('Error fetching staffs:', error);
      message.error(`Error fetching staff data: ${error.message}`);
    }
  };

  const fetchWorkOrderData = async () => {
    try {
      const workOrderData = await getWorkOrderDropdownList();
      setWorkOrders(workOrderData.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      message.error(`Error fetching work order data: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let savedTimesheet;
      if (id === 'new') {
        savedTimesheet = await createTimesheet(values);
        message.success('Timesheet created successfully');
      } else {
        savedTimesheet = await updateTimesheet(id, values);
        message.success('Timesheet updated successfully');
      }
      setEditMode(false);
      setTimesheetData(savedTimesheet);
    } catch (error) {
      console.error('Error saving timesheet:', error);
      message.error(`Error saving timesheet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTimesheet(id);
      message.success('Timesheet deleted successfully');
      navigate('/timesheets');
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      message.error(`Error deleting timesheet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/timesheets');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      form.setFieldsValue(timesheetData);
    }
  };

  return (
    <div>
      <h2>Timesheet Details</h2>
      {!editMode && timesheetData ? (
        <div>
          <p><Text strong>Staff:</Text> {staffs.find(s => s.id === timesheetData.StaffID)?.name}</p>
          <p><Text strong>Work Order:</Text> {workOrders.find(w => w.id === timesheetData.WorkOrderID)?.description}</p>
          <p><Text strong>Date:</Text> {moment(timesheetData.Date).format('YYYY-MM-DD')}</p>
          <p><Text strong>Hours:</Text> {timesheetData.Hours}</p>
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
            name="StaffID"
            label="Staff"
            rules={[{ required: true, message: 'Please select a staff member!' }]}
          >
            <Select>
              {staffs.map(staff => (
                <Option key={staff.id} value={staff.id}>
                  {staff.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="WorkOrderID"
            label="Work Order"
            rules={[{ required: true, message: 'Please select a work order!' }]}
          >
            <Select>
              {workOrders.map(workOrder => (
                <Option key={workOrder.id} value={workOrder.id}>
                  {workOrder.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="Hours"
            label="Hours"
            rules={[{ required: true, message: 'Please input the hours worked!' }]}
          >
            <Input type="number" step="0.5" />
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
    </div>
  );
};

export default TimesheetDetail;
