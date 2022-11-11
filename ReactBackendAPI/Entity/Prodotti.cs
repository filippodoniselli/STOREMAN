namespace ReactBackendAPI.Entity
{
    public partial class Prodotti
    {
        public int Id { get; set; }
        public string Nome { get; set; } = null!;
        public string? Descrizione { get; set; }
        public double Prezzo { get; set; }
        public int Quantità { get; set; }
        public int? Categoria { get; set; }
        public int Creatore { get; set; }
        public DateTime Data { get; set; }

        public virtual Categorie? CategoriaNavigation { get; set; }
    }
}
