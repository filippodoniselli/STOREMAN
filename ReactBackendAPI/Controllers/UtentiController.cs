using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ReactBackendAPI.Entity;

namespace ReactBackendAPI.Controllers
{
    [Route("[controller]/[action]/")]
    [ApiController]
    public class UtentiController : ControllerBase
    {

        [HttpGet]
        public List<Privilegi> GetPrivilegi()
        {
            StoreManCtx ctx = new StoreManCtx();
            return ctx.Privilegis.ToList();
        }

        [HttpGet]
        public Utenti Check(string parameters)
        {
            string[] elements = parameters.Replace(" ", "").Split('|');
            if (elements.Length == 2 && !elements.Contains(""))
            {
                StoreManCtx ctx = new StoreManCtx();
                Utenti? uten = ctx.Utentis.Where(x => x.Username == elements[0] && x.Password == elements[1]).FirstOrDefault();
                if (uten != null)
                {
                    return uten;
                }
                else
                {
                    return new Utenti() { Id = 0 };
                }

            }
            else
            {
                return new Utenti() { Id = -1 };
            }
        }


        [HttpGet]
        public List<Utenti> All()
        {
            StoreManCtx ctx = new StoreManCtx();
            List<Utenti> utes = ctx.Utentis.Where(x => x.Id > 1).Select(x => new Utenti() { Id = x.Id, Creatore = x.Creatore, Username = x.Username, Password = x.Password, Data = x.Data, Privilegi = x.Privilegi, PrivilegiNavigation = ctx.Privilegis.Where(p => p.Id == x.Privilegi).First() }).ToList();
            return utes;
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
                    Utenti ute = ctx.Utentis.Where(x=> x.Id == (int)body["id"]).FirstOrDefault();
                    if (ute != null)
                    {
                        ctx.Utentis.Remove(ute);
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
                    Utenti ute = new Utenti() { Username = (string)body["username"], Password = (string)body["password"], Creatore = (int)body["creatore"], Privilegi = (int)body["privilegi"], Data = DateTime.Now };
                    ctx.Utentis.Add(ute);
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
                    Utenti? ute = ctx.Utentis.Where(x => x.Id == (int)body["id"]).FirstOrDefault();
                    if (ute == null)
                    {
                        HttpContext.Response.StatusCode = 404;
                        return "Non trovato su DB";
                    }
                    else
                    {
                        ute.Creatore = ute.Creatore == (int)body["creatore"] ? 0 : (int)body["creatore"];
                        ute.Username = (string)body["username"];
                        ute.Password = (string)body["password"];
                        ute.Privilegi = (int)body["privilegi"];
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

