/*
  Habilita Change Tracking en la base ShipTrack para el Azure SQL trigger de Functions.
  Ejecutar después de CreateShipTrack.sql.

  Referencia: https://learn.microsoft.com/azure/azure-functions/functions-bindings-azure-sql-trigger
*/

USE ShipTrack;
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.change_tracking_databases WHERE database_id = DB_ID(N'ShipTrack')
)
BEGIN
  ALTER DATABASE ShipTrack
  SET CHANGE_TRACKING = ON
  (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.change_tracking_tables t
  INNER JOIN sys.tables tb ON t.object_id = tb.object_id
  WHERE SCHEMA_NAME(tb.schema_id) = N'dbo' AND tb.name = N'Shipments'
)
BEGIN
  ALTER TABLE dbo.Shipments ENABLE CHANGE_TRACKING;
END
GO

PRINT N'Change Tracking habilitado en ShipTrack y dbo.Shipments.';
GO
