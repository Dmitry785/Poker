using Microsoft.AspNetCore.Mvc;
using Server.Application.ResultApi;
using Server.Domain;

namespace Server.Application.Services
{
    public record Constraint<T>(Predicate<T> Condition, string ErrorMessage);
    public class AuthenticationService
    {
        public List<User> RegisteredUsers { get; } = new List<User>();
        public List<string>? WhiteList { get; set; }
        public List<Constraint<string>> NicknamePolicies { get; } = new List<Constraint<string>>();
        public List<Constraint<string>> PasswordPolicies { get; } = new List<Constraint<string>>();
        public Result<Guid> Register(string nickname, string password, bool isSpectator)
        {
            var validateNicknameResult = ValidateNickname(nickname);
            var validatePasswordResult = ValidatePassword(password);
            if (!validateNicknameResult.Success)
                return Result<Guid>.Fail(validateNicknameResult.ErrorMessage!);
            if(!validatePasswordResult.Success)
                return Result<Guid>.Fail(validatePasswordResult.ErrorMessage!);
            if (RegisteredUsers.Find(x=>x.Nickname == nickname) != null)
                return Result<Guid>.Fail($"Nickname {nickname} already in use");
            var user = new User(nickname, isSpectator, password);
            RegisteredUsers.Add(user);
            return Result<Guid>.Ok(user.Id);
        }
        public Result<Guid> Login(string nickname, string password)
        {
            var user = RegisteredUsers.Find(x => x.Nickname == nickname);
            if(user is null)
            {
                return Result<Guid>.Fail("User not found");
            }
            if(user.Password == password)
                return Result<Guid>.Ok(user.Id);
            return Result<Guid>.Fail("Wrong password");
        }
        public Result<User> GetUserById(Guid? id)
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
        private Result ValidatePassword(string password)
        {
            foreach (var constraint in PasswordPolicies)
            {
                if (!constraint.Condition(password))
                    return Result.Fail(constraint.ErrorMessage);
            }
            return Result.Ok();
        }
    }
}
