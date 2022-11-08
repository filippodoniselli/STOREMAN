using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace ReactBackendAPI.Entity
{
    public partial class StoreManCtx : DbContext
    {
        public StoreManCtx()
        {
        }

        public StoreManCtx(DbContextOptions<StoreManCtx> options)
            : base(options)
        {
        }

        public virtual DbSet<Categorie> Categories { get; set; } = null!;
        public virtual DbSet<Privilegi> Privilegis { get; set; } = null!;
        public virtual DbSet<Prodotti> Prodottis { get; set; } = null!;
        public virtual DbSet<Utenti> Utentis { get; set; } = null!;

        private static bool checkDB = false;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                            .AddJsonFile("appsettings.json")
                            .Build();
                if (!checkDB)
                {
                    AssureDBExistence();
                    checkDB = true;
                }
                optionsBuilder.UseSqlServer(configuration.GetConnectionString("StoreDB"));
            }
        }

        private void AssureDBExistence()
        {
            SqlConnection sqlConnection = new SqlConnection("server = (local)\\SQLEXPRESS; Trusted_Connection = yes");
            try
            {
                sqlConnection.Open();
                SqlCommand check = new SqlCommand("SELECT database_id FROM sys.databases WHERE Name = 'StoreMan'", sqlConnection);
                object result = check.ExecuteScalar();
                if (result == null || (int)result < 0)
                {
                    string[] CreateScript = File.ReadAllText(Directory.GetCurrentDirectory() + "\\Entity\\CreateDBScript.txt").Split("--SPLIT");
                    SqlCommand createDB = new SqlCommand(CreateScript[0], sqlConnection);
                    createDB.ExecuteNonQuery();
                    SqlCommand createTables = new SqlCommand(CreateScript[1], sqlConnection);
                    createTables.ExecuteNonQuery();
                }
            }
            catch (Exception EX)
            {
                string MARIO = EX.Message;
                int U = 1;
            }
            finally
            {
                sqlConnection.Close();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categorie>(entity =>
            {
                entity.ToTable("Categorie");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Data).HasColumnType("smalldatetime");

                entity.Property(e => e.Nome)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatoreNavigation)
                    .WithMany(p => p.Categories)
                    .HasForeignKey(d => d.Creatore)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Categorie_Utenti");
            });

            modelBuilder.Entity<Privilegi>(entity =>
            {
                entity.ToTable("Privilegi");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Data).HasColumnType("smalldatetime");

                entity.Property(e => e.Descrizione)
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Prodotti>(entity =>
            {
                entity.ToTable("Prodotti");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Data).HasColumnType("smalldatetime");

                entity.Property(e => e.Descrizione)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Nome)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.HasOne(d => d.CategoriaNavigation)
                    .WithMany(p => p.Prodottis)
                    .HasForeignKey(d => d.Categoria)
                    .HasConstraintName("FK_Prodotti_Categorie");

                entity.HasOne(d => d.CreatoreNavigation)
                    .WithMany(p => p.Prodottis)
                    .HasForeignKey(d => d.Creatore)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Prodotti_Utenti");
            });

            modelBuilder.Entity<Utenti>(entity =>
            {
                entity.ToTable("Utenti");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Data).HasColumnType("smalldatetime");

                entity.Property(e => e.Password)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Username)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.HasOne(d => d.PrivilegiNavigation)
                    .WithMany(p => p.Utentis)
                    .HasForeignKey(d => d.Privilegi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Utenti_Privilegi");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    }
}
