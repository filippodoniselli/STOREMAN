using Microsoft.AspNetCore.Mvc;
using ReactBackendAPI.Entity;

namespace ReactBackendAPI.Controllers
{
    [Route("[controller]/[action]/")]
    [ApiController]
    public class CategorieController : Controller
    {
        [HttpGet]
        public List<Categorie> GetCategorie()
        {
            StoreManCtx ctx = new StoreManCtx();
            return ctx.Categories.ToList();
        }

        [HttpGet]
        public Object[] GetCategorieNotNull()
        {
            StoreManCtx ctx = new StoreManCtx();
            var mario = ctx.Categories.Where(x => x.Prodottis.Count() > 0).Select(x=> new { id = x.Id, nome = x.Nome, quantity = ctx.Prodottis.Where(t => t.Categoria == x.Id && t.Quantità == 0).Count() }).ToList(); ;
            return mario.ToArray();
        }

        [HttpGet]
        public string Remove(int parameters)
        {
            StoreManCtx ctx = new StoreManCtx();
            Categorie? cate = ctx.Categories.Where(x => x.Id == parameters).FirstOrDefault();
            if (cate != null)
            {
                try
                {
                    ctx.Categories.Remove(cate);
                    ctx.Prodottis.RemoveRange(ctx.Prodottis.Where(x=> x.Categoria == parameters).ToList());
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
        public string Add(string parameters)
        {
            string[] elements = parameters.Split("|");
            if (elements.Length == 2 && !elements.Contains(""))
            {
                StoreManCtx ctx = new StoreManCtx();
                Categorie mario = new Categorie() { Creatore = Convert.ToInt32(elements[0]), Nome = elements[1], Data = DateTime.Now };
                try
                {
                    ctx.Categories.Add(mario);
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

        [HttpPost]
        public string Edit(string parameters)
        {
            string[] elements = parameters.Split("|");
            if (elements.Length == 3 && !elements.Contains(""))
            {
                StoreManCtx ctx = new StoreManCtx();
                try
                {
                    Categorie? mario = ctx.Categories.Where(x => x.Id == Convert.ToInt32(elements[2])).FirstOrDefault();
                    if (mario == null)
                    {
                        return "Modifica fallita";
                    }
                    else
                    {
                        mario.Creatore = Convert.ToInt32(elements[0]);
                        mario.Nome = elements[1];
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

    }
}
