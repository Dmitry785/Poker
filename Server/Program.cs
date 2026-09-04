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
                    p.WithOrigins("http://localhost:5173")
                        .AllowCredentials()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddControllers();

            builder.Services.AddSignalR();

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
