using MeetingManagement.Api.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetingManagement.Api.Domain;

public class MeetingManagementDbContext(DbContextOptions<MeetingManagementDbContext> options) : DbContext(options)
{
    public DbSet<MeetingRoom> MeetingRooms => Set<MeetingRoom>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Meeting> Meetings => Set<Meeting>();
}
