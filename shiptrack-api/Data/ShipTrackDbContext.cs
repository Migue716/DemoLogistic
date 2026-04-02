using Microsoft.EntityFrameworkCore;

namespace ShipTrack.Api.Data;

public class ShipTrackDbContext : DbContext
{
    public ShipTrackDbContext(DbContextOptions<ShipTrackDbContext> options)
        : base(options)
    {
    }

    public DbSet<ShipmentEntity> Shipments => Set<ShipmentEntity>();
    public DbSet<RecentShipmentEntity> RecentShipments => Set<RecentShipmentEntity>();
    public DbSet<KpiCardEntity> KpiCards => Set<KpiCardEntity>();
    public DbSet<ShipmentByStatusEntity> ShipmentByStatus => Set<ShipmentByStatusEntity>();
    public DbSet<DocumentEntity> Documents => Set<DocumentEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ShipmentEntity>(e =>
        {
            e.ToTable("Shipments");
            e.HasKey(x => x.ShipmentId);
            e.Property(x => x.ShipmentId).HasMaxLength(20);
            e.Property(x => x.Client).HasMaxLength(200);
            e.Property(x => x.Origin).HasMaxLength(200);
            e.Property(x => x.Destination).HasMaxLength(200);
            e.Property(x => x.Status).HasMaxLength(50);
            e.Property(x => x.Eta).HasColumnType("date");
        });

        modelBuilder.Entity<RecentShipmentEntity>(e =>
        {
            e.ToTable("RecentShipments");
            e.HasKey(x => x.SortOrder);
            e.Property(x => x.ShipmentId).HasMaxLength(20);
            e.HasOne<ShipmentEntity>()
                .WithMany()
                .HasForeignKey(x => x.ShipmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<KpiCardEntity>(e =>
        {
            e.ToTable("KpiCards");
            e.Property(x => x.Label).HasMaxLength(100);
            e.Property(x => x.Value).HasMaxLength(50);
            e.Property(x => x.MetricChange).HasMaxLength(20);
            e.Property(x => x.ChangeLabel).HasMaxLength(50);
            e.Property(x => x.Icon).HasMaxLength(50);
        });

        modelBuilder.Entity<ShipmentByStatusEntity>(e =>
        {
            e.ToTable("ShipmentByStatus");
            e.Property(x => x.Status).HasMaxLength(50);
            e.Property(x => x.Color).HasMaxLength(80);
        });

        modelBuilder.Entity<DocumentEntity>(e =>
        {
            e.ToTable("Documents");
            e.Property(x => x.Title).HasMaxLength(300);
            e.Property(x => x.SizeLabel).HasMaxLength(20);
            e.Property(x => x.DocType).HasMaxLength(20);
            e.Property(x => x.DocDate).HasColumnType("date");
        });
    }
}

public class ShipmentEntity
{
    public string ShipmentId { get; set; } = "";
    public string Client { get; set; } = "";
    public string Origin { get; set; } = "";
    public string Destination { get; set; } = "";
    public string Status { get; set; } = "";
    public DateOnly Eta { get; set; }
}

public class RecentShipmentEntity
{
    public int SortOrder { get; set; }
    public string ShipmentId { get; set; } = "";
}

public class KpiCardEntity
{
    public int Id { get; set; }
    public int SortOrder { get; set; }
    public string Label { get; set; } = "";
    public string Value { get; set; } = "";
    public string MetricChange { get; set; } = "";
    public string ChangeLabel { get; set; } = "";
    public string Icon { get; set; } = "";
}

public class ShipmentByStatusEntity
{
    public int Id { get; set; }
    public int SortOrder { get; set; }
    public string Status { get; set; } = "";
    public int Count { get; set; }
    public string Color { get; set; } = "";
}

public class DocumentEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public DateOnly DocDate { get; set; }
    public string SizeLabel { get; set; } = "";
    public string DocType { get; set; } = "";
}
