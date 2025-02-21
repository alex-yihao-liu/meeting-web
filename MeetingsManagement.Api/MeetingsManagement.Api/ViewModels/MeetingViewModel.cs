namespace MeetingManagement.Api.Domain.Models;

public class MeetingViewModel
{
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public string Name { get; set; } = string.Empty;
    public User? Creator { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Description { get; set; }
    public List<string> Participants { get; set; } = [];
    public Guid MeetingRoomId { get; set; }
}
