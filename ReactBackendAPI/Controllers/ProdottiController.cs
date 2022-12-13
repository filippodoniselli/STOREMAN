using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
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

        [HttpDelete]
        public string Remove()
        {
            HttpContext.Request.EnableBuffering();
            string result = new StreamReader(HttpContext.Request.Body).ReadToEndAsync().Result;
            try
            {
                JObject body = JObject.Parse(result);
                if (body != null)
                {
                    StoreManCtx ctx = new StoreManCtx();
                    Prodotti ute = ctx.Prodottis.Where(x => x.Id == (int)body["id"]).FirstOrDefault();
                    if (ute != null)
                    {
                        ctx.Prodottis.Remove(ute);
                        ctx.SaveChanges();
                        return "Rimosso con successo";
                    }
                    else
                    {
                        HttpContext.Response.StatusCode = 404;
                        return "Non trovato su DB";
                    }

                }
                else
                {
                    HttpContext.Response.StatusCode = 400;
                    return "Caratteri non validi";
                }
            }
            catch
            {
                HttpContext.Response.StatusCode = 409;
                return "Rimozione fallita";
            }
        }

        [HttpPatch]
        public string Edit()
        {
            HttpContext.Request.EnableBuffering();
            string result = new StreamReader(HttpContext.Request.Body).ReadToEndAsync().Result;
            try
            {
                JObject body = JObject.Parse(result);
                if (body != null)
                {
                    StoreManCtx ctx = new StoreManCtx();
                    Prodotti? prod = ctx.Prodottis.Where(x => x.Id == (int)body["id"]).FirstOrDefault();
                    if (prod == null)
                    {
                        HttpContext.Response.StatusCode = 404;
                        return "Non trovato su DB";
                    }
                    else
                    {
                        prod.Creatore = prod.Creatore == (int)body["creatore"] ? 0 : (int)body["creatore"];
                        prod.Nome = (string)body["nome"];
                        prod.Descrizione = (string)body["descrizione"];
                        prod.Categoria = ctx.Categories.Where(x => x.Nome == (string)body["categoria"]).FirstOrDefault().Id;
                        prod.Prezzo = Convert.ToDouble(body["prezzo"].ToString().Replace(".", ","));
                        prod.Quantità = (int)body["quantità"];
                        ctx.SaveChanges();
                        return "Modificato correttamente";
                    }
                }
                else
                {
                    HttpContext.Response.StatusCode = 400;
                    return "Caratteri non validi";
                }
            }
            catch
            {
                HttpContext.Response.StatusCode = 409;
                return "Modifica fallita";
            }
        }

        [HttpPost]
        public string Add()
        {
            HttpContext.Request.EnableBuffering();
            string result = new StreamReader(HttpContext.Request.Body).ReadToEndAsync().Result;
            try
            {
                JObject body = JObject.Parse(result);
                if (body != null)
                {
                    StoreManCtx ctx = new StoreManCtx();
                    Prodotti prod = new Prodotti() { Nome = (string)body["nome"], Descrizione = (string)body["descrizione"], Creatore = (int)body["creatore"], Categoria = ctx.Categories.Where(x=> x.Nome == (string)body["categoria"]).FirstOrDefault().Id, Prezzo = Convert.ToDouble(body["prezzo"].ToString().Replace(".",",")), Quantità = (int)body["quantità"], Data = DateTime.Now };
                    ctx.Prodottis.Add(prod);
                    ctx.SaveChanges();
                    return "Aggiunto correttamente";
                }
                else
                {
                    HttpContext.Response.StatusCode = 400;
                    return "Caratteri non validi";
                }
            }
            catch
            {
                HttpContext.Response.StatusCode = 409;
                return "Aggiunta fallita";
            }
        }
    }
}
