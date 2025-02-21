using MeetingManagement.Api.ViewModels;

namespace MeetingManagement.Api.Features.UserFeature
{
    public class GetAllUsersResponse
    {
        public IEnumerable<UserViewModel> Items { get; set; } = new List<UserViewModel>();
        public int Total { get; set; } = 0;
    }
}
