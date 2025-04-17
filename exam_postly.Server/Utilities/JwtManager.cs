
using exam_postly.Server.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace exam_postly.Server.Utilities
{
    public class JwtManager
    {
        
        //public static object GenerateAccessToken(string email, int id)
        //{

        //    var securityKey = new SymmetricSecurityKey(
        //    Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        //    var claims = new[]
        //    {
        //        new Claim(JwtRegisteredClaimNames.Sub, id),
        //        new Claim(JwtRegisteredClaimNames.Email, email),
        //        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        //    };

        //    var token = new JwtSecurityToken(
        //        issuer: _config["Jwt:Issuer"],
        //        audience: _config["Jwt:Audience"],
        //        claims: claims,
        //        expires: DateTime.UtcNow.AddMinutes(15), // Short-lived
        //        signingCredentials: credentials
        //    );

        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}
    }
}
