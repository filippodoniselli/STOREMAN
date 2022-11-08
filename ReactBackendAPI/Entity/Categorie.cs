namespace ReactBackendAPI.Entity
{
    public partial class Categorie
    {
        public Categorie()
        {
            Prodottis = new HashSet<Prodotti>();
        }

        public int Id { get; set; }
        public string Nome { get; set; } = null!;
        public int Creatore { get; set; }
        public DateTime Data { get; set; }

        public virtual Utenti CreatoreNavigation { get; set; } = null!;
        public virtual ICollection<Prodotti> Prodottis { get; set; }
    }
}
