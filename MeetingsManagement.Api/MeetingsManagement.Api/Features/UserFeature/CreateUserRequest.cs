namespace MeetingManagement.Api.Features.UserFeature;

public class CreateUserRequest
{
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
}