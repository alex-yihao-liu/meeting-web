namespace MeetingManagement.Api.Domain.Models;

public class Meeting : Entity
{
    public string Name { get; set; } = string.Empty;
    public User? Creator { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Description { get; set; }
    public List<string> Participants { get; set; } = [];
    public MeetingRoom? MeetingRoom { get; set; }
    public Guid MeetingRoomId { get; set; }
    public MeetingStatus Status { get; set; }

    public static Meeting Book(string name, Guid creatorId, Guid meetingRoomId, DateTime startTime, DateTime endTime, List<string> participants, string description = "")
    {
        return new Meeting
        {
            StartTime = startTime,
            EndTime = endTime,
            Participants = participants,
            Name = name,
            MeetingRoomId = meetingRoomId,
            CreatorId = creatorId,
            Description = description,
            Status = MeetingStatus.Booked,
        };
    }
}

public enum MeetingStatus
{
    Booked,
    Started,
    Finished,
}
