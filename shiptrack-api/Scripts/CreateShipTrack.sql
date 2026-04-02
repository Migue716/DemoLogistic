/*
  ShipTrack — creación de base de datos, tablas y datos iniciales.
  Ejecutar en SQL Server Management Studio o sqlcmd contra (localdb)\MSSQLLocalDB.

  Connection string típico para la API (añade Initial Catalog=ShipTrack):
    Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=ShipTrack;Integrated Security=True;...

  Con Encrypt=True, en LocalDB a veces hace falta Trust Server Certificate=True (ver appsettings).

  Si la base ya existe, comenta o elimina el bloque CREATE DATABASE.

  Para Azure Functions con SqlTrigger en Shipments, ejecuta también
  Scripts/EnableChangeTracking.sql
*/

SET NOCOUNT ON;
GO

IF DB_ID(N'ShipTrack') IS NULL
BEGIN
  CREATE DATABASE ShipTrack;
END
GO

USE ShipTrack;
GO

/* --- Eliminar tablas si re-ejecutas el script (orden por FKs) --- */
IF OBJECT_ID(N'dbo.RecentShipments', N'U') IS NOT NULL DROP TABLE dbo.RecentShipments;
IF OBJECT_ID(N'dbo.Documents', N'U') IS NOT NULL DROP TABLE dbo.Documents;
IF OBJECT_ID(N'dbo.ShipmentByStatus', N'U') IS NOT NULL DROP TABLE dbo.ShipmentByStatus;
IF OBJECT_ID(N'dbo.KpiCards', N'U') IS NOT NULL DROP TABLE dbo.KpiCards;
IF OBJECT_ID(N'dbo.Shipments', N'U') IS NOT NULL DROP TABLE dbo.Shipments;
GO

CREATE TABLE dbo.Shipments (
  ShipmentId    VARCHAR(20)   NOT NULL CONSTRAINT PK_Shipments PRIMARY KEY,
  Client        NVARCHAR(200) NOT NULL,
  Origin        NVARCHAR(200) NOT NULL,
  Destination   NVARCHAR(200) NOT NULL,
  Status        NVARCHAR(50)  NOT NULL,
  Eta           DATE          NOT NULL
);
GO

CREATE TABLE dbo.RecentShipments (
  SortOrder     INT           NOT NULL CONSTRAINT PK_RecentShipments PRIMARY KEY,
  ShipmentId    VARCHAR(20)   NOT NULL,
  CONSTRAINT FK_RecentShipments_Shipments FOREIGN KEY (ShipmentId)
    REFERENCES dbo.Shipments (ShipmentId)
);
GO

CREATE TABLE dbo.KpiCards (
  Id            INT            IDENTITY(1,1) NOT NULL CONSTRAINT PK_KpiCards PRIMARY KEY,
  SortOrder     INT            NOT NULL,
  Label         NVARCHAR(100)  NOT NULL,
  Value         NVARCHAR(50)   NOT NULL,
  MetricChange  NVARCHAR(20)   NOT NULL,
  ChangeLabel   NVARCHAR(50)   NOT NULL,
  Icon          NVARCHAR(50)   NOT NULL
);
GO

CREATE TABLE dbo.ShipmentByStatus (
  Id            INT            IDENTITY(1,1) NOT NULL CONSTRAINT PK_ShipmentByStatus PRIMARY KEY,
  SortOrder     INT            NOT NULL,
  Status        NVARCHAR(50)   NOT NULL,
  Count         INT            NOT NULL,
  Color         NVARCHAR(80)   NOT NULL
);
GO

CREATE TABLE dbo.Documents (
  Id            INT            IDENTITY(1,1) NOT NULL CONSTRAINT PK_Documents PRIMARY KEY,
  Title         NVARCHAR(300)  NOT NULL,
  DocDate       DATE           NOT NULL,
  SizeLabel     NVARCHAR(20)   NOT NULL,
  DocType       VARCHAR(20)    NOT NULL
);
GO

/* --- Shipments (tabla principal) --- */
INSERT INTO dbo.Shipments (ShipmentId, Client, Origin, Destination, Status, Eta) VALUES
(N'SHP-2024-001', N'Tech Solutions Inc', N'Shanghai, China', N'Los Angeles, USA', N'In Transit', '2026-03-19'),
(N'SHP-2024-002', N'Global Imports Ltd', N'Hamburg, Germany', N'New York, USA', N'Customs', '2026-03-20'),
(N'SHP-2024-003', N'Pacific Trading Co', N'Tokyo, Japan', N'Seattle, USA', N'Delivered', '2026-03-17'),
(N'SHP-2024-004', N'Euro Logistics', N'Rotterdam, Netherlands', N'Chicago, USA', N'In Transit', '2026-03-21'),
(N'SHP-2024-005', N'Asia Pacific Ltd', N'Singapore', N'San Francisco, USA', N'Pending', '2026-03-25'),
(N'SHP-2024-006', N'Nordic Cargo', N'Oslo, Norway', N'Boston, USA', N'In Transit', '2026-03-22'),
(N'SHP-2024-007', N'Mediterranean Freight', N'Barcelona, Spain', N'Miami, USA', N'Customs', '2026-03-23');
GO

/* --- Orden de la lista "Recent" (mismo conjunto que el mock) --- */
INSERT INTO dbo.RecentShipments (SortOrder, ShipmentId) VALUES
(1, 'SHP-2024-001'),
(2, 'SHP-2024-002'),
(3, 'SHP-2024-003'),
(4, 'SHP-2024-004'),
(5, 'SHP-2024-005');
GO

INSERT INTO dbo.KpiCards (SortOrder, Label, Value, MetricChange, ChangeLabel, Icon) VALUES
(1, N'Active Shipments', N'1,247', N'+12%', N'vs last week', N'box'),
(2, N'In Transit', N'892', N'+8%', N'vs last week', N'truck'),
(3, N'In Customs', N'156', N'-3%', N'vs last week', N'customs'),
(4, N'Delivered Today', N'43', N'+22%', N'vs last week', N'check');
GO

INSERT INTO dbo.ShipmentByStatus (SortOrder, Status, Count, Color) VALUES
(1, N'Pending', 199, N'var(--pending)'),
(2, N'In Transit', 892, N'var(--success)'),
(3, N'In Customs', 156, N'var(--warning)'),
(4, N'Delivered', 2341, N'var(--info)');
GO

INSERT INTO dbo.Documents (Title, DocDate, SizeLabel, DocType) VALUES
(N'Bill of Lading - SHP-2024-001', '2026-03-10', N'2.4 MB', N'bill'),
(N'Commercial Invoice - SHP-2024-002', '2026-03-11', N'1.8 MB', N'invoice'),
(N'Packing List - SHP-2024-003', '2026-03-12', N'956 KB', N'invoice'),
(N'Certificate of Origin - SHP-2024-004', '2026-03-13', N'1.2 MB', N'certificate'),
(N'Customs Declaration - SHP-2024-005', '2026-03-14', N'3.1 MB', N'bill'),
(N'Insurance Certificate - SHP-2024-006', '2026-03-15', N'1.5 MB', N'certificate');
GO

PRINT N'ShipTrack: tablas y datos iniciales listos.';
GO
