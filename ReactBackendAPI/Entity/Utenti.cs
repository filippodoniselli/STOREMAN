namespace ReactBackendAPI.Entity
{
    public partial class Utenti
    {
        public Utenti()
        {
            Categories = new HashSet<Categorie>();
            Prodottis = new HashSet<Prodotti>();
        }

        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int Privilegi { get; set; }
        public int? Creatore { get; set; }
        public DateTime Data { get; set; }

        public virtual Privilegi PrivilegiNavigation { get; set; } = null!;
        public virtual ICollection<Categorie> Categories { get; set; }
        public virtual ICollection<Prodotti> Prodottis { get; set; }
    }
}
