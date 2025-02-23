using MeetingManagement.Api.Domain;
using MeetingManagement.Api.Services;
using MeetingManagement.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace MeetingsManagement.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly MeetingManagementDbContext _dbContext;
    private readonly JwtService _jwtService;

    public AuthController(MeetingManagementDbContext dbContext, JwtService jwtService)
    {
        _dbContext = dbContext;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null)
        {
            return Unauthorized("Username or Password incorrect");
        }

        byte[] passwordData = Encoding.ASCII.GetBytes(request.Password);
        var hashedPassword = SHA256.HashData(passwordData);
        var hashedPasswordString = Convert.ToBase64String(hashedPassword);

        if (user.HashedPassword != hashedPasswordString)
        {
            return Unauthorized("Username or Password incorrect");
        }

        var token = _jwtService.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            Username = user.Username,
            DisplayName = user.DisplayName,
            Email = user.Email,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };
    }
}
