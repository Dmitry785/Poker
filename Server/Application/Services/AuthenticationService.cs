using Microsoft.AspNetCore.Mvc;
using Server.Application.ResultApi;
using Server.Domain;

namespace Server.Application.Services
{
    public record NicknameConstraint(Predicate<string> Condition, string ErrorMessage);
    public class AuthenticationService
    {
        public List<User> RegisteredUsers { get; } = new List<User>();
        public List<string>? WhiteList { get; set; }
        public bool CanRegistrationOverride { get; set; } = false;
        public List<NicknameConstraint> NicknamePolicies { get; } = new List<NicknameConstraint>();
        public Result<Guid> Register(string nickname, string password, bool isSpectator)
        {
            var validateNicknameResult = ValidateNickname(nickname);
            if (!validateNicknameResult.Success)
                return Result<Guid>.Fail(validateNicknameResult.ErrorMessage!);
            if (RegisteredUsers.Find(x=>x.Nickname == nickname) != null)
            {
                if (!CanRegistrationOverride)
                    return Result<Guid>.Fail($"Nickname {nickname} already in use");
                RegisteredUsers.Remove(RegisteredUsers.First(x => x.Nickname == nickname));
            }
            var user = new User(nickname, isSpectator, password);
            RegisteredUsers.Add(user);
            return Result<Guid>.Ok(user.Id);
        }
        public Result<Guid> Login(string nickname, string password)
        {
            var user = RegisteredUsers.Find(x => x.Nickname == nickname && x.Password == password);
            if(user is null)
            {
                return Result<Guid>.Fail("User not found");
            }
            return Result<Guid>.Ok(user.Id);
        }
        public Result<User> GetUserRegisterInfoById(Guid? id)
        {
            if (id == null)
                return Result<User>.Fail("Id is null");
            var user = RegisteredUsers.Find(x => x.Id == id);
            if (user is not null)
            {
                return Result<User>.Ok(user);
            }
            return Result<User>.Fail($"couldn't find nickname by id {id}");
        }
        private Result ValidateNickname(string nickname)
        {
            if (WhiteList?.Contains(nickname) ?? false)
                return Result.Fail("Nickname not in white list");
            foreach (var constraint in NicknamePolicies)
            {
                if (!constraint.Condition(nickname))
                    return Result.Fail(constraint.ErrorMessage);
            }
            return Result.Ok();
        }
    }
}
