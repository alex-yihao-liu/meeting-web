using MeetingManagement.Api.Domain;
using MeetingManagement.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingManagement.Api.Features.UserFeature;

[ApiController]
[Route("[controller]")]
public class UserController(MeetingManagementDbContext dbContext) : ControllerBase
{
    private readonly MeetingManagementDbContext _dbContext = dbContext;

    [HttpGet]
    [ProducesResponseType(typeof(GetAllUsersResponse), 200)]
    public async Task<GetAllUsersResponse> GetAll([FromQuery] int page, [FromQuery] int pageSize)
    {
        var users = await _dbContext.Users
            .OrderByDescending(x => x.CreatedTime)
            .Select(x => new UserViewModel
            {
                Id = x.Id,
                Username = x.Username,
                DisplayName = x.DisplayName,
                Email = x.Email,
            })
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync();
        return new GetAllUsersResponse
        {
            Items = users,
            Total = await _dbContext.Users.CountAsync()
        };
    }


    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(typeof(UserViewModel), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(new UserViewModel
        {
            Id = user.Id,
            Username = user.Username,
            DisplayName = user.DisplayName,
            Email = user.Email
        });
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        var user = Domain.Models.User.Create(request.Username, request.DisplayName, request.Email, "123456");
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    //// 更新用户
    //[HttpPut("{id}")]
    //public async Task<IActionResult> Update(Guid id, [FromBody] User user)
    //{
    //    if (id != user.Id)
    //    {
    //        return BadRequest();
    //    }

    //    _dbContext.Entry(user).State = EntityState.Modified;
    //    await _dbContext.SaveChangesAsync();
    //    return NoContent();
    //}

    // 删除用户
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}