namespace Server.Application.Services.Extensions
{
    public static class RegisterServiceExtensions
    {
        static public RegisterService WithPlayerRegistrationOverrideAvailability(this RegisterService service, bool availability = true)
        {
            service.CanRegistrationOverride = availability;
            return service;
        }
    }
}
