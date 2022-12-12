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
            List<Utenti> mario = ctx.Utentis.Where(x=> x.Id> 1).Select(x => new Utenti() { Id = x.Id, Creatore = x.Creatore, Username = x.Username, Password = x.Password, Data = x.Data, Privilegi = x.Privilegi, PrivilegiNavigation = ctx.Privilegis.Where(p => p.Id == x.Privilegi).First() }).ToList();
            return mario;
        }

        [HttpGet]
        public string Remove(int parameters)
        {
            StoreManCtx ctx = new StoreManCtx();
            Utenti? user = ctx.Utentis.Where(x => x.Id == parameters).FirstOrDefault();
            if (user != null)
            {
                try
                {
                    ctx.Utentis.Remove(user);
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
        public string Add()
        {
            HttpContext.Request.EnableBuffering();
            string sasr = new StreamReader(HttpContext.Request.Body).ReadToEndAsync().Result;
            if (sasr != null)
            {
                try
                {
                    JObject body = JObject.Parse(sasr);
                    StoreManCtx ctx = new StoreManCtx();
                    Utenti mario = new Utenti() { Username = (string)body["username"], Password = (string)body["password"], Creatore = (int)body["creatore"], Privilegi = (int)body["privilegi"], Data = DateTime.Now };
                    ctx.Utentis.Add(mario);
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
            string[] elements = parameters.Replace(" ", "").Split("|");
            if (elements.Length == 5 && !elements.Contains(""))
            {
                StoreManCtx ctx = new StoreManCtx();
                try
                {
                    Utenti? mario = ctx.Utentis.Where(x => x.Id == Convert.ToInt32(elements[3])).FirstOrDefault();
                    if (mario == null)
                    {
                        return "Modifica fallita";
                    }
                    else
                    {
                        mario.Creatore = mario.Creatore == Convert.ToInt32(elements[0]) ? 0 : Convert.ToInt32(elements[0]);
                        mario.Username = elements[1];
                        mario.Password = elements[2];
                        mario.Privilegi = Convert.ToInt32(elements[4]);
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

