using exam_postly.Server.DTOs;
using System.Security.Cryptography;

namespace exam_postly.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public User(string name, string email, string passwordHash, string salt)
        {
            Name = name;
            Email = email;
            PasswordHash = passwordHash;
            Salt = salt;
        }

        public User() { }
    }
}
