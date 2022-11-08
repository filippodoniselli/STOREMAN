namespace ReactBackendAPI.Entity
{
    public partial class Privilegi
    {
        public Privilegi()
        {
            Utentis = new HashSet<Utenti>();
        }

        public int Id { get; set; }
        public string Descrizione { get; set; } = null!;
        public DateTime Data { get; set; }

        public virtual ICollection<Utenti> Utentis { get; set; }
    }
}
