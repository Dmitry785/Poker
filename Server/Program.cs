using Microsoft.Extensions.FileProviders;
using Server.Application.Services;
using Server.Application.Services.Extensions;
using Server.Hubs;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Services conriguration
            builder.Services.AddCors((options) =>
            {
                options.AddPolicy("SignalRPolicy", (p) =>
                {
                    p.SetIsOriginAllowed(o => true)
                     .AllowCredentials()
                     .AllowAnyHeader()
                     .AllowAnyMethod();
                });
            });
            builder.Services.AddControllers();
            builder.Services.AddSignalR();

            var gameService = new GameService()
                .WithPlayerAvailable(6)
                .WithStartMoney(1000);
            var registerService = new RegisterService()
                .WithPlayerRegistrationOverrideAvailability()
                .WithPlayerNameConstraint(x=>!String.IsNullOrEmpty(x), "Никнейм не должен быть пустым");

            builder.Services.AddSingleton(registerService);
            builder.Services.AddSingleton(gameService);
            builder.Services.AddSingleton<ChatService>();

            var app = builder.Build();


            //Application configuration
            app.UseCors("SignalRPolicy");

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
