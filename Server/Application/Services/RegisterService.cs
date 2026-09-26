using Microsoft.AspNetCore.Mvc;
using Server.Application.ResultApi;
using Server.Domain;

namespace Server.Application.Services
{
    public record NicknameConstraint(Predicate<string> Condition, string ErrorMessage);
    public class RegisterService
    {
        public List<User> RegisteredUsers { get; } = new List<User>();
        public bool CanRegistrationOverride { get; set; } = false;
        public List<NicknameConstraint> NicknamePolicies { get; } = new List<NicknameConstraint>();
        public Result<Guid> Register(string nickname, bool isSpectator)
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
            var user = new User(nickname, isSpectator);
            RegisteredUsers.Add(user);
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
            foreach (var constraint in NicknamePolicies)
            {
                if (!constraint.Condition(nickname))
                    return Result.Fail(constraint.ErrorMessage);
            }
            return Result.Ok();
        }
    }
}
