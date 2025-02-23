namespace MeetingManagement.Api.Features.MeetingFeature;

public class BookMeetingRequest
{
    public string Name { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public List<string> Participants { get; set; }
    public string Description { get; set; }
    public Guid MeetingRoomId { get; set; }
}
