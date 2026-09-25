namespace Server.Application.Services.Extensions
{
    public static class RegisterServiceExtensions
    {
        static public RegisterService WithPlayerRegistrationOverrideAvailability(this RegisterService service, bool availability = true)
        {
            service.CanRegistrationOverride = availability;
            return service;
        }
        static public RegisterService WithPlayerNameConstraint(this RegisterService service, Predicate<string> constraint, string errorMessage)
        {
            service.NicknamePolicies.Add(new NicknameConstraint(constraint, errorMessage));
            return service;
        }
    }
}
