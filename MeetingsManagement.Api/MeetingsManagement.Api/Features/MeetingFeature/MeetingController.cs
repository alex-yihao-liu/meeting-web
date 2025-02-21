using MeetingManagement.Api.Domain;
using MeetingManagement.Api.Domain.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MeetingManagement.Api.Features.MeetingFeature;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class MeetingController(MeetingManagementDbContext dbContext) : ControllerBase
{
    private readonly MeetingManagementDbContext _dbContext = dbContext;
    private Guid? CurrentUserId => User.FindFirst(ClaimTypes.NameIdentifier) is { Value: var value } ? Guid.Parse(value) : null;
    ///// <summary>
    ///// 获取当前登录用户信息
    ///// </summary>
    //[HttpGet("current-user")]
    //public async Task<ActionResult<UserViewModel>> GetCurrentUser()
    //{
    //    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    //    if (userId == null || !Guid.TryParse(userId, out var userGuid))
    //    {
    //        return Unauthorized();
    //    }

    //    var user = await _dbContext.Users
    //        .FirstOrDefaultAsync(u => u.Id == userGuid);

    //    if (user == null)
    //    {
    //        return NotFound("用户不存在");
    //    }

    //    return new UserViewModel
    //    {
    //        Id = user.Id,
    //        Username = user.Username,
    //        DisplayName = user.DisplayName,
    //        Email = user.Email
    //    };
    //}

    [HttpGet]
    public async Task<IEnumerable<MeetingViewModel>> Get()
    {
        return await _dbContext.Meetings
            .Select(x => new MeetingViewModel
            {
                Id = x.Id,
                Name = x.Name,
                CreatorId = x.CreatorId,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                Description = x.Description,
                Participants = x.Participants,
                MeetingRoomId = x.MeetingRoomId,
                CreatedTime = x.CreatedTime
            })
            .ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Book([FromBody] BookMeetingRequest request)
    {
        var meeting = Meeting.Book(request.Name, CurrentUserId!.Value, request.MeetingRoomId, request.StartTime, request.EndTime, request.Participants, request.Description);

        _dbContext.Meetings.Add(meeting);
        await _dbContext.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = meeting.Id }, meeting);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Meeting meeting)
    {
        if (id != meeting.Id)
        {
            return BadRequest();
        }

        _dbContext.Entry(meeting).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var meeting = await _dbContext.Meetings.FindAsync(id);
        if (meeting == null)
        {
            return NotFound();
        }

        _dbContext.Meetings.Remove(meeting);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}