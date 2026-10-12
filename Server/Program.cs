using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Server.Application.Services;
using Server.Application.Services.Extensions;
using Server.Hubs;
using Server.Infrastructure;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            if(!Directory.Exists("Static"))
            {
                Directory.CreateDirectory("Static");
            }

            //Services conriguration
            builder.Services.AddCors((options) =>
            {
                options.AddPolicy("CorsPolicy", (p) =>
                {
                    p.SetIsOriginAllowed(o => true)
                     .AllowCredentials()
                     .AllowAnyHeader()
                     .AllowAnyMethod();
                });
            });
            builder.Services.AddControllers();
            builder.Services.AddSignalR();

            var connectionString = builder.Configuration.GetConnectionString("NpgsqlConnectionString");

            builder.Services.AddDbContext<AppDbContext>(options=>options.UseLazyLoadingProxies().UseNpgsql(connectionString));

            builder.Services.AddScoped<ChatService>();

            builder.Services.AddSingleton(x=> new GameService()
                .WithPlayerAvailable(6)
                .WithStartMoney(1000));

            builder.Services.AddScoped(sp =>
            {
                var context = sp.GetRequiredService<AppDbContext>();
                return new AuthenticationService(context)
                    .WithNicknameConstraint(x => !String.IsNullOrEmpty(x), "Никнейм не должен быть пустым")
                    .WithPasswordConstraint(x => !String.IsNullOrEmpty(x), "Пароль не должен быть пустым")
                    .WithPasswordConstraint(x => x.Length <= 8, "Пароль должен быть не больше 8 символов");
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
                scope.ServiceProvider
                    .GetRequiredService<AppDbContext>()
                    .AddDefaultData();

            //Application configuration
            app.UseCors("CorsPolicy");

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Static")),
                RequestPath = "/static"
            });

            app.MapControllers();

            app.MapHub<ChatHub>("/chat");

            app.Run();
        }
    }
}
