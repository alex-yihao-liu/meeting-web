namespace MeetingManagement.Api.ViewModels
{
    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    public class LoginResponse
    {
        public required string Token { get; set; }
        public required string Username { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
