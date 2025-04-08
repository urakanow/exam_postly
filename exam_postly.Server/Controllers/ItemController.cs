using exam_postly.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace exam_postly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private static readonly User[] users = { new User("dev1", "dev1@gmail.com", "password1"), new User("dev2", "dev2@gmail.com", "password2") };


        [HttpGet(Name = "GetItem")]
        public IEnumerable<User> Get()
        {
            return Enumerable.AsEnumerable(users);
        }
    }
}
