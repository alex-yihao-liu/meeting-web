namespace MeetingManagement.Api.Domain.Models;

public abstract class Entity
{
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
}
