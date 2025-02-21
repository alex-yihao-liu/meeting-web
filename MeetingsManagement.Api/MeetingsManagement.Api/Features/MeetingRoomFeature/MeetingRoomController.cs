using MeetingManagement.Api.Domain;
using MeetingManagement.Api.Domain.Models;
using MeetingManagement.Api.Features.MeetingRoomFeature;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingManagement.Api.Features.UserFeature;

[ApiController]
[Route("meeting-room")]
public class MeetingRoomController(MeetingManagementDbContext dbContext) : ControllerBase
{
    private readonly MeetingManagementDbContext _dbContext = dbContext;

    [HttpGet]
    [ProducesResponseType(typeof(GetAllUsersResponse), 200)]
    public async Task<GetAllMeetingRoomsResponse> GetAll([FromQuery] int page, [FromQuery] int pageSize)
    {
        var items = await _dbContext.MeetingRooms
            .OrderByDescending(x => x.CreatedTime)
            .Select(x => new MeetingRoomViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            })
            .Skip(pageSize * page)
            .Take(pageSize)
            .ToListAsync();
        return new GetAllMeetingRoomsResponse
        {
            Items = items,
            Total = await _dbContext.MeetingRooms.CountAsync()
        };
    }


    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(typeof(MeetingRoomViewModel), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Get(Guid id)
    {
        var meetingRoom = await _dbContext.MeetingRooms.FindAsync(id);
        if (meetingRoom == null)
        {
            return NotFound();
        }
        return Ok(new MeetingRoomViewModel
        {
            Id = meetingRoom.Id,
            Name = meetingRoom.Name,
            Description = meetingRoom.Description
        });
    }


    [HttpPost]
    [ProducesResponseType(typeof(MeetingRoomViewModel), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateMeetingRoomRequest request)
    {
        var meetingRoom = MeetingRoom.Create(request.Name, request.Description);
        _dbContext.MeetingRooms.Add(meetingRoom);
        await _dbContext.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = meetingRoom.Id }, meetingRoom);
    }


    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var meetingRoom = await _dbContext.MeetingRooms.FindAsync(id);
        if (meetingRoom == null)
        {
            return NotFound();
        }

        _dbContext.MeetingRooms.Remove(meetingRoom);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}