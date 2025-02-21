namespace MeetingManagement.Api.Features.MeetingRoomFeature;

public class CreateMeetingRoomRequest
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public class MeetingRoomViewModel
{
    public string Name { get; set; }
    public string Description { get; set; }
    public Guid Id { get; set; }
}

public class GetAllMeetingRoomsResponse
{
    public IEnumerable<MeetingRoomViewModel> Items { get; set; } = [];
    public int Total { get; set; } = 0;
}