using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
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
            var mario = ctx.Categories.Where(x => x.Prodottis.Count() > 0).Select(x => new { id = x.Id, nome = x.Nome, quantity = ctx.Prodottis.Where(t => t.Categoria == x.Id && t.Quantità == 0).Count() }).ToList(); ;
            return mario.ToArray();
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
                    Categorie cat = ctx.Categories.Where(x => x.Id == (int)body["id"]).FirstOrDefault();
                    if (cat != null)
                    {
                        ctx.Categories.Remove(cat);
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
                    Categorie cat = new Categorie() { Nome = (string)body["nome"], Creatore = (int)body["creatore"], Data = DateTime.Now };
                    ctx.Categories.Add(cat);
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
                    Categorie? cat = ctx.Categories.Where(x => x.Id == (int)body["id"]).FirstOrDefault();
                    if (cat == null)
                    {
                        HttpContext.Response.StatusCode = 404;
                        return "Non trovato su DB";
                    }
                    else
                    {
                        cat.Creatore = (int)body["creatore"];
                        cat.Nome = (string)body["nome"];
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

    }
}
