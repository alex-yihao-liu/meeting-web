
namespace MeetingManagement.Api.Domain.Models;

public class MeetingRoom : Entity
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public bool IsEnabled { get; set; }

    public static MeetingRoom Create(string name, string description = "")
    {
        return new MeetingRoom { Name = name, Description = description, IsEnabled = true };
    }


}
