using System.Security.Cryptography;

namespace MeetingManagement.Api.Domain.Models;

public class User : Entity
{
    public required string Username { get; set; }
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public required string HashedPassword { get; set; }

    public static User Create(string username, string displayName, string email, string password)
    {
        byte[] data = System.Text.Encoding.ASCII.GetBytes(password);
        var hashedPasswordBytes = SHA256.HashData(data);

        return new User
        {
            Username = username,
            HashedPassword = Convert.ToBase64String(hashedPasswordBytes),
            Email = email,
            DisplayName = displayName,
        };
    }
}

