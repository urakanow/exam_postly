using exam_postly.Server.DTOs;
using exam_postly.Server.Models;
using exam_postly.Server.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace exam_postly.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        //private static readonly User[] users = { new User("dev1", "dev1@gmail.com", "password1", "bebra"), new User("dev2", "dev2@gmail.com", "password2", "bebra") };
        private readonly ApplicationDBContext _dbContext;
        private readonly IConfiguration _config;

        public UserController(ApplicationDBContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;
        }

        [HttpGet(Name = "GetUsers")]
        public async Task<ActionResult> GetUsers()
        {
            var users = _dbContext.Users;
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

                //var user = new User(dto.Name, dto.Email, hashedPassword, salt);
                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    PasswordHash = hashedPassword,
                    Salt = salt
                };

                await _dbContext.Users.AddAsync(user);
                await _dbContext.SaveChangesAsync();
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
                var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Email == email);
                if(user == null)
                {
                    return Unauthorized("wrong email or password");
                }

                if (!PasswordEncryptor.VerifyPassword(password, user.PasswordHash, user.Salt))
                {
                    return Unauthorized("wrong email or password");
                }

                var accessToken = GenerateAccessToken(user.Email, user.Id);

                var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
                var hashedRefreshToken = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));
                //var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);
                var refreshTokenExpiry = DateTime.UtcNow.AddMinutes(10);//small value for a test

                await _dbContext.AddAsync(new RefreshToken
                {
                    TokenHash = hashedRefreshToken,
                    UserId = user.Id,
                    ExpiresAt = refreshTokenExpiry,
                    User = user
                });
                await _dbContext.SaveChangesAsync();

                Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = refreshTokenExpiry
                });

                return Ok(new { AccessToken = accessToken });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateAccessToken(string email, int id)
        {

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                //expires: DateTime.UtcNow.AddMinutes(15),
                expires: DateTime.UtcNow.AddMinutes(1), // small value for a test
                
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Route("refresh")]
        [HttpPost(Name = "Refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

            var hashedToken = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));
            var storedToken = await _dbContext.RefreshTokens
                .Include(refreshToken => refreshToken.User)
                .FirstOrDefaultAsync(token => token.TokenHash == hashedToken && !token.IsRevoked);

            if(storedToken?.ExpiresAt < DateTime.UtcNow) return Unauthorized();

            var user = storedToken.User;
            var newAccessToken = GenerateAccessToken(user.Email, user.Id);

            storedToken.IsRevoked = true;
            await _dbContext.SaveChangesAsync();

            var newRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            var hashedNewRefreshToken = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));

            var refreshTokenExpiry = DateTime.UtcNow.AddMinutes(2);//small value for a test

            await _dbContext.AddAsync(new RefreshToken
            {
                TokenHash = hashedNewRefreshToken,
                UserId = user.Id,
                ExpiresAt = refreshTokenExpiry,
                User = user
            });
            await _dbContext.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = refreshTokenExpiry
            });

            return Ok(new { AccessToken = newAccessToken });
        }

        [Authorize]
        [Route("personal-page")]
        [HttpGet(Name = "GetCurrentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            // Step 1: Get the user's ID from the token
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (userId == null)
                return Unauthorized();

            // Step 2: Fetch user data from DB
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null)
                return NotFound("user not found");

            // Step 3: Return safe user data (exclude passwords/etc)
            return Ok(new { user.Id, user.Email, user.Name });
        }
    }
}
