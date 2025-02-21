using MeetingManagement.Api.Domain;
using MeetingManagement.Api.Services;
using MeetingManagement.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace MeetingsManagement.Api.Controllers
{
    /// <summary>
    /// 提供身份验证功能
    /// </summary>
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

        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="request">登录请求</param>
        /// <returns>登录结果，包含JWT令牌</returns>
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            // 获取用户信息
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return Unauthorized("用户名或密码错误");
            }

            // 验证密码
            byte[] passwordData = Encoding.ASCII.GetBytes(request.Password);
            var hashedPassword = SHA256.HashData(passwordData);
            var hashedPasswordString = Convert.ToBase64String(hashedPassword);

            if (user.HashedPassword != hashedPasswordString)
            {
                return Unauthorized("用户名或密码错误");
            }

            // 生成JWT令牌
            var token = _jwtService.GenerateToken(user);

            // 返回登录响应
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
}
