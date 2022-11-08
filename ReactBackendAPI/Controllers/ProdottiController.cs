using Microsoft.AspNetCore.Mvc;
using ReactBackendAPI.Entity;

namespace ReactBackendAPI.Controllers
{
    [Route("[controller]/[action]/")]
    [ApiController]
    public class ProdottiController : Controller
    {

        [HttpGet]
        public List<Prodotti> GetProdotti(string parameters)
        {
            StoreManCtx ctx = new StoreManCtx();
            if (parameters != "All")
            {
                return ctx.Prodottis.Where(x => x.CategoriaNavigation != null && x.CategoriaNavigation.Nome == parameters).Select(x => new Prodotti() { Id = x.Id, Nome = x.Nome, Descrizione = x.Descrizione, Categoria = x.Categoria, CategoriaNavigation = ctx.Categories.Where(c => c.Id == x.Categoria).FirstOrDefault(), Prezzo = x.Prezzo, Creatore = x.Creatore, Quantità = x.Quantità }).ToList();
            }
            else
            {
                return ctx.Prodottis.Select(x => new Prodotti() { Id = x.Id, Nome = x.Nome, Descrizione = x.Descrizione, Categoria = x.Categoria, CategoriaNavigation = ctx.Categories.Where(c => c.Id == x.Categoria).FirstOrDefault(), Prezzo = x.Prezzo, Creatore = x.Creatore, Quantità = x.Quantità }).ToList();
            }
        }

        [HttpGet]
        public string Remove(int parameters)
        {
            StoreManCtx ctx = new StoreManCtx();
            Prodotti? mario = ctx.Prodottis.Where(x => x.Id == parameters).FirstOrDefault();
            if (mario != null)
            {
                try
                {
                    ctx.Prodottis.Remove(mario);
                    ctx.SaveChanges();
                    return "Rimosso con successo";
                }
                catch
                {
                    return "Rimozione fallita";
                }
            }
            else
            {
                return "Non presente su DB";
            }
        }

        [HttpPost]
        public string Edit(string parameters)
        {
            string[] elements = parameters.Split("|");
            if (elements.Length == 7)
            {
                StoreManCtx ctx = new StoreManCtx();
                try
                {
                    Prodotti? mario = ctx.Prodottis.Where(x => x.Id == Convert.ToInt32(elements[1])).FirstOrDefault();
                    if (mario == null)
                    {
                        return "Modifica fallita";
                    }
                    else
                    {
                        mario.Creatore = Convert.ToInt32(elements[0]);
                        mario.Nome = elements[2];
                        mario.Descrizione = elements[3];
                        mario.Categoria = ctx.Categories.Where(x => x.Nome == elements[4]).FirstOrDefault()?.Id;
                        mario.Prezzo = Convert.ToDouble(elements[5].Replace(".", ","));
                        mario.Quantità = Convert.ToInt32(elements[6]);
                        ctx.SaveChanges();
                        return "Modificato correttamente";
                    }
                }
                catch
                {
                    return "Modifica fallita";
                }
            }
            else
            {
                return "Caratteri non validi";
            }
        }

        [HttpPost]
        public string Add(string parameters)
        {
            string[] elements = parameters.Split("|");
            if (elements.Length == 6)
            {
                StoreManCtx ctx = new StoreManCtx();
                Prodotti mario = new Prodotti() { Creatore = Convert.ToInt32(elements[0]), Nome = elements[1], Descrizione = elements[2], Categoria = ctx.Categories.Where(x => x.Nome == elements[3]).FirstOrDefault()?.Id, Prezzo = Convert.ToDouble(elements[4].Replace(".", ",")), Quantità = Convert.ToInt32(elements[5]), Data = DateTime.Now };
                try
                {
                    ctx.Prodottis.Add(mario);
                    ctx.SaveChanges();
                    return "Aggiunto correttamente";
                }
                catch
                {
                    return "Aggiunta fallita";
                }
            }
            else
            {
                return "Caratteri non validi";
            }
        }


    }
}
