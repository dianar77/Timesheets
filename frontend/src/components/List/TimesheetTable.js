import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, DatePicker, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getTimesheets, updateTimesheet, deleteTimesheet, createTimesheet, getTimesheetByStaff, getTimesheetByWorkOrder } from '../../services/Timesheetapi';
import { getWorkOrderDropdownList } from '../../services/WorkOrderapi';
import { getStaffsDropdownList } from '../../services/Staffapi';
import moment from 'moment';
import './TimesheetTable.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
      inputNode = <DatePicker format="YYYY-MM-DD" />;
      break;
    case 'select':
      if (dataIndex === 'StaffID') {
        inputNode = (
          <Select>
            {staff.map(s => (
              <Option key={s.id} value={s.id}>{s.name}</Option>
            ))}
          </Select>
        );
      } else if (dataIndex === 'WorkOrderID') {
        inputNode = (
          <Select>
            {workOrders.map(wo => (
              <Option key={wo.id} value={wo.id}>{`${wo.name}`}</Option>
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
          initialValue={inputType === 'date' && record[dataIndex] ? moment(record[dataIndex]) : record[dataIndex]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TimesheetTable = ( staffId = null, workOrderId = null) => {
  const [form] = Form.useForm();
  const [timesheets, setTimesheets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTimesheet, setNewTimesheet] = useState(null);
  const [filters, setFilters] = useState({
    staff: null,
    workOrder: null,
    dateRange: null,
  });
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    fetchTimesheets();
    fetchStaff();
    fetchWorkOrders();
  }, [staffId, workOrderId]);

  useEffect(() => {
    if (editingKey === '') {
      fetchTimesheets();
    }
  }, [editingKey]);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);

      let data;

      if (staffId && staffId.staffId) {
        data = await getTimesheetByStaff(staffId.staffId);
      } else if (staffId && staffId.workOrderId) {
        data = await getTimesheetByWorkOrder(staffId.workOrderId);
      } else {
        data = await getTimesheets();
      }
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
      const staffData = await getStaffsDropdownList();
      setStaff(staffData.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error(`Error fetching staff data: ${error.message}`);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const workOrderData = await getWorkOrderDropdownList();
      setWorkOrders(workOrderData.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      message.error(`Error fetching work order data: ${error.message}`);
    }
  };

  const isEditing = (record) => record.TimesheetID === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      Date: record.Date ? moment(record.Date) : null,
      StaffID: record.StaffID,
      WorkOrderID: record.WorkOrderID,
      Hours: record.Hours
    });
    setEditingKey(record.TimesheetID);
  };

  const cancel = () => {
    setEditingKey('');
    if (newTimesheet) {
      setNewTimesheet(null);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      let updatedTimesheet;
      
      if (key === 'new') {
        updatedTimesheet = await createTimesheet(row);
        setTimesheets(prev => [updatedTimesheet, ...prev]);
        setNewTimesheet(null);
      } else {
        const updatedItem = { 
          ...row, 
          TimesheetID: key,
          Date: row.Date ? row.Date.format('YYYY-MM-DD') : null,
          StaffID: Number(row.StaffID),
          WorkOrderID: Number(row.WorkOrderID),
          Hours: Number(row.Hours)
        };
        updatedTimesheet = await updateTimesheet(key, updatedItem);
        setTimesheets(prev => prev.map(item => 
          item.TimesheetID === key ? updatedTimesheet : item
        ));
      }
      
      setEditingKey('');
      message.success('Timesheet saved successfully');
      
      setTimesheets(prev => [...prev]);
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
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

  const handleAdd = () => {
    const newTimesheetData = {
      TimesheetID: 'new',
      StaffID: null,
      WorkOrderID: null,
      Date: null,
      Hours: 0,
    };
    setNewTimesheet(newTimesheetData);
    setEditingKey('new');
    form.setFieldsValue(newTimesheetData);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    return (
      (!filters.staff || timesheet.StaffID === filters.staff) &&
      (!filters.workOrder || timesheet.WorkOrderID === filters.workOrder) &&
      (!filters.dateRange || 
        (moment(timesheet.Date).isSameOrAfter(filters.dateRange[0], 'day') &&
         moment(timesheet.Date).isSameOrBefore(filters.dateRange[1], 'day')))
    );
  });

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const FilterHeader = () => (
    <tr className="filter-row">
      <th>
        <Select
          style={{ width: '100%' }}
          placeholder="Filter by Staff"
          onChange={(value) => handleFilterChange('staff', value)}
          allowClear
        >
          {staff.map(s => (
            <Option key={s.id} value={s.id}>{s.name}</Option>
          ))}
        </Select>
      </th>
      <th>
        <Select
          style={{ width: '100%' }}
          placeholder="Filter by Work Order"
          onChange={(value) => handleFilterChange('workOrder', value)}
          allowClear
        >
          {workOrders.map(wo => (
            <Option key={wo.id} value={wo.id}>{`${wo.name}`}</Option>
          ))}
        </Select>
      </th>
      <th>
        <RangePicker
          style={{ width: '100%' }}
          onChange={(dates) => handleFilterChange('dateRange', dates)}
        />
      </th>
      <th></th> {/* Empty cell for Hours column */}
      <th></th> {/* Empty cell for Actions column */}
      <th></th> {/* Extra empty cell to match the number of columns */}
    </tr>
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'TimesheetID',
      key: 'TimesheetID',
      editable: false,
      hidden: true,
      sorter: (a, b) => a.TimesheetID - b.TimesheetID,
      sortOrder: sortedInfo.columnKey === 'TimesheetID' && sortedInfo.order,
    },
    {
      title: 'Staff',
      dataIndex: 'StaffID',
      key: 'StaffID',
      editable: true,
      render: (staffId) => {
        const staffMember = staff.find(s => s.id === staffId);
        return staffMember ? staffMember.name : 'Unknown';
      },
      sorter: (a, b) => {
        const staffA = staff.find(s => s.id === a.StaffID);
        const staffB = staff.find(s => s.id === b.StaffID);
        return staffA.name.localeCompare(staffB.name);
      },
      sortOrder: sortedInfo.columnKey === 'StaffID' && sortedInfo.order,
    },
    {
      title: 'Work Order',
      dataIndex: 'WorkOrderID',
      key: 'WorkOrderID',
      editable: true,
      render: (workOrderId) => {
        const workOrder = workOrders.find(wo => wo.id === workOrderId);
        return workOrder ? workOrder.name : 'Unknown';
      },
      sorter: (a, b) => {
        const woA = workOrders.find(wo => wo.id === a.WorkOrderID);
        const woB = workOrders.find(wo => wo.id === b.WorkOrderID);
        if (!woA || !woB) return 0;
        const taskA = woA.name ? woA.name.toString() : '';
        const taskB = woB.name ? woB.name.toString() : '';
        return taskA.localeCompare(taskB);
      },
      sortOrder: sortedInfo.columnKey === 'WorkOrderID' && sortedInfo.order,
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      editable: true,
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : '',
      sorter: (a, b) => moment(a.Date).unix() - moment(b.Date).unix(),
      sortOrder: sortedInfo.columnKey === 'Date' && sortedInfo.order,
    },
    {
      title: 'Hours',
      dataIndex: 'Hours',
      key: 'Hours',
      editable: true,
      sorter: (a, b) => a.Hours - b.Hours,
      sortOrder: sortedInfo.columnKey === 'Hours' && sortedInfo.order,
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
  }).filter(col => !col.hidden);

  return (
    <div>
      <h2>{staffId.staffId ? 'Timesheet for this Staff' : (staffId.workOrderId ? 'Timesheet for this Work Order' : 'Timesheet Table')}</h2>
      {!staffId.staffId && !staffId.workOrderId && (
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />}>
        Add Timesheet
      </Button>
      )}
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
          dataSource={newTimesheet ? [newTimesheet, ...filteredTimesheets] : filteredTimesheets}
          rowKey={(record) => record.TimesheetID}
          bordered
          style={{ background: 'white' }}
          onChange={handleChange}
        />
      </Form>
    </div>
  );
};

export default TimesheetTable;
