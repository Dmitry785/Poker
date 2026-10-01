namespace Server.Application.Services.Extensions
{
    public static class AuthenticationServiceExtensions
    {
        static public AuthenticationService WithPlayerRegistrationOverrideAvailability(this AuthenticationService service, bool availability = true)
        {
            service.CanRegistrationOverride = availability;
            return service;
        }
        static public AuthenticationService WithWhiteList(this AuthenticationService service, List<string> whiteList)
        {
            service.WhiteList = whiteList;
            return service;
        }

        static public AuthenticationService WithPlayerNameConstraint(this AuthenticationService service, Predicate<string> constraint, string errorMessage)
        {
            service.NicknamePolicies.Add(new NicknameConstraint(constraint, errorMessage));
            return service;
        }
    }
}
