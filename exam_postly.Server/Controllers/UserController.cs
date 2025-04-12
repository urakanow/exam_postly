using exam_postly.Server.DTOs;
using exam_postly.Server.Models;
using exam_postly.Server.Utilities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Security.Cryptography;

namespace exam_postly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        //private static readonly User[] users = { new User("dev1", "dev1@gmail.com", "password1", "bebra"), new User("dev2", "dev2@gmail.com", "password2", "bebra") };
        private ApplicationDBContext dbContext;

        public UserController(ApplicationDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet(Name = "GetUsers")]
        public async Task<ActionResult> GetUsers()
        {
            var users = dbContext.Users;
            return Ok(users);
            //return Enumerable.AsEnumerable(users);
        }

        [Route("signup")]
        [HttpPost(Name = "CreateUser")]
        public async Task<ActionResult> CreateUser([FromBody] UserCreateDTO dto)
        {
            try
            {
                var saltPasswordPair = PasswordEncryptor.EncryptPassword(dto.Password);
                string hashedPassword = saltPasswordPair.hashedPassword;
                string salt = saltPasswordPair.salt;

                var user = new User(dto.Name, dto.Email, hashedPassword, salt);

                await dbContext.Users.AddAsync(user);
                await dbContext.SaveChangesAsync();
                return Ok("user created");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("signin")]
        [HttpPost(Name = "AuthenticateUser")]
        public async Task<ActionResult> AuthenticateUser([FromBody] LoginDTO dto)
        {
            string email = dto.Email;
            string password = dto.Password;

            try
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Email == email);
                if(user == null)
                {
                    return Unauthorized("wrong email or password");
                }

                if (!PasswordEncryptor.VerifyPassword(password, user.PasswordHash, user.Salt))
                {
                    return Unauthorized("wrong email or password");
                }

                var accessToken = "sample token";
                return Ok(accessToken);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
