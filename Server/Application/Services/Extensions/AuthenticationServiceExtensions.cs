namespace Server.Application.Services.Extensions
{
    public static class AuthenticationServiceExtensions
    {
        static public AuthenticationService WithWhiteList(this AuthenticationService service, List<string> whiteList)
        {
            service.WhiteList = whiteList;
            return service;
        }

        static public AuthenticationService WithNicknameConstraint(this AuthenticationService service, Predicate<string> constraint, string errorMessage)
        {
            service.NicknamePolicies.Add(new Constraint<string>(constraint, errorMessage));
            return service;
        }
        static public AuthenticationService WithPasswordConstraint(this AuthenticationService service, Predicate<string> constraint, string errorMessage)
        {
            service.PasswordPolicies.Add(new Constraint<string>(constraint, errorMessage));
            return service;
        }
    }
}
