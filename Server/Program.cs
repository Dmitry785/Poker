using Server.Application.Services;
using Server.Hubs;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

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

            builder.Services.AddSingleton<RegisterService>();
            builder.Services.AddSingleton<ChatHistoryService>();

            var app = builder.Build();

            app.UseCors("SignalRPolicy");

           /* app.UseDefaultFiles();
            app.UseStaticFiles();*/

            app.MapControllers();

            app.MapHub<ChatHub>("/chat");

            app.Run();
        }
    }
}
