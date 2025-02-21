using MeetingManagement.Api.Domain;
using MeetingManagement.Api.Domain.Models;
using MeetingManagement.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "meeting_management.db");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 添加CORS配置
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // React开发服务器地址
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 添加JWT配置
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// 注册JwtService
builder.Services.AddScoped<JwtService>();

builder.Services.AddDbContext<MeetingManagementDbContext>(opts => opts
    .UseSqlite($"Data Source={dbPath}")
    .UseSeeding((context, _) =>
    {
        if (!context.Set<User>().Any())
        {
            context.AddRange(
                User.Create("admin", "Administrator", "admin@gmail.com", "123456"),
                User.Create("user001", "Alice Johnson", "alice.johnson@example.com", "123456"),
                User.Create("user002", "Bob Smith", "bob.smith@example.com", "123456"),
                User.Create("user003", "Charlie Brown", "charlie.brown@example.com", "123456"),
                User.Create("user004", "David Wilson", "david.wilson@example.com", "123456"),
                User.Create("user005", "Emma Davis", "emma.davis@example.com", "123456"),
                User.Create("user006", "Frank Miller", "frank.miller@example.com", "123456"),
                User.Create("user007", "Grace Lee", "grace.lee@example.com", "123456"),
                User.Create("user008", "Henry Clark", "henry.clark@example.com", "123456"),
                User.Create("user009", "Isabella Lewis", "isabella.lewis@example.com", "123456"),
                User.Create("user010", "Jack Walker", "jack.walker@example.com", "123456"),
                User.Create("user011", "Karen Hall", "karen.hall@example.com", "123456"),
                User.Create("user012", "Leo Young", "leo.young@example.com", "123456"),
                User.Create("user013", "Mia Allen", "mia.allen@example.com", "123456"),
                User.Create("user014", "Nathan King", "nathan.king@example.com", "123456"),
                User.Create("user015", "Olivia Scott", "olivia.scott@example.com", "123456"),
                User.Create("user016", "Paul Wright", "paul.wright@example.com", "123456"),
                User.Create("user017", "Quinn Baker", "quinn.baker@example.com", "123456"),
                User.Create("user018", "Rachel Green", "rachel.green@example.com", "123456"),
                User.Create("user019", "Samuel Adams", "samuel.adams@example.com", "123456"),
                User.Create("user020", "Tina Perez", "tina.perez@example.com", "123456"),

                MeetingRoom.Create("Meeting Room in Xi'an"),
                MeetingRoom.Create("Meeting Room in BeiJing"),
                MeetingRoom.Create("Meeting Room in ShangHai")
            );
        }
        context.SaveChanges();
    })
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// 添加认证中间件
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
