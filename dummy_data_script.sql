-- Disable foreign key constraints temporarily
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"

-- Clear existing data (if any)
DELETE FROM [dbo].[Timesheets];
DELETE FROM [dbo].[WorkOrders];
DELETE FROM [dbo].[Projects];
DELETE FROM [dbo].[Vessels];
DELETE FROM [dbo].[Clients];
DELETE FROM [dbo].[Staff];
DELETE FROM [dbo].[Disciplines];

-- Reset identity columns
DBCC CHECKIDENT ('[dbo].[Timesheets]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[WorkOrders]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Projects]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Vessels]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Clients]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Staff]', RESEED, 0);

-- Insert dummy data into Clients
INSERT INTO [dbo].[Clients] ([Name]) VALUES
('Oceanic Shipping Co.'),
('Coastal Cruises Ltd.'),
('Global Marine Services');

-- Insert dummy data into Disciplines
INSERT INTO [dbo].[Disciplines] ([DisciplineID], [Name], [Rate]) VALUES
(1, 'Engineer', 100.00),
(2, 'Technician', 75.00),
(3, 'Designer', 90.00);

-- Insert dummy data into Vessels
INSERT INTO [dbo].[Vessels] ([Name], [Num], [ClientID]) VALUES
('Atlantic Voyager', 101, 1),
('Pacific Explorer', 102, 2),
('Arctic Surveyor', 103, 3);

-- Insert dummy data into Projects
INSERT INTO [dbo].[Projects] ([Name], [Num], [VesselID]) VALUES
('Engine Overhaul', 1001, 1),
('Navigation System Upgrade', 1002, 2),
('Hull Inspection', 1003, 3);

-- Insert dummy data into WorkOrders
INSERT INTO [dbo].[WorkOrders] ([Task#], [Description], [ProjectID]) VALUES
(1, 'Disassemble main engine', 1),
(2, 'Install new GPS modules', 2),
(3, 'Perform ultrasonic testing on hull', 3);

-- Insert dummy data into Staff
INSERT INTO [dbo].[Staff] ([Name], [PersonalID], [DisciplineID]) VALUES
('John Doe', 'EMP001', 1),
('Jane Smith', 'EMP002', 2),
('Bob Johnson', 'EMP003', 3);

-- Insert dummy data into Timesheets
INSERT INTO [dbo].[Timesheets] ([StaffID], [WorkOrderID], [Date], [Hours]) VALUES
(1, 1, '2024-10-18', 8.5),
(2, 2, '2024-10-18', 7.0),
(3, 3, '2024-10-18', 6.5);

-- Re-enable foreign key constraints
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"
