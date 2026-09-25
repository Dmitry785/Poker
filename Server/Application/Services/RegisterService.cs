using Microsoft.AspNetCore.Mvc;
using Server.Application.ResultApi;

namespace Server.Application.Services
{
    public record UserRegisterData(string Nickname, bool IsSpectator);
    public record NicknameConstraint(Predicate<string> Condition, string ErrorMessage);
    public class RegisterService
    {
        public Dictionary<Guid, UserRegisterData> RegisteredUsers { get; } = new Dictionary<Guid, UserRegisterData>();
        public bool CanRegistrationOverride { get; set; } = false;
        public List<NicknameConstraint> NicknamePolicies { get; } = new List<NicknameConstraint>();
        public Result<Guid> Register(string nickname, bool isSpectator)
        {
            var id = Guid.NewGuid();
            foreach (var constraint in NicknamePolicies)
            {
                if(!constraint.Condition(nickname))
                    return Result<Guid>.Fail(constraint.ErrorMessage);
            }
            if (RegisteredUsers.Values.FirstOrDefault(x=>x.Nickname == nickname) != null)
            {
                if (!CanRegistrationOverride)
                    return Result<Guid>.Fail($"Nickname {nickname} already in use");
                RegisteredUsers.Remove(RegisteredUsers.First(x => x.Value.Nickname == nickname).Key);
            }
            RegisteredUsers.Add(id, new UserRegisterData(nickname, isSpectator));
            return Result<Guid>.Ok(id);
        }
        public Result<UserRegisterData> GetUserRegisterInfoById(Guid? id)
        {
            if (id == null)
                return Result<UserRegisterData>.Fail("Id is null");
            if(RegisteredUsers.TryGetValue((Guid)id, out var userInfo))
            {
                return Result<UserRegisterData>.Ok(userInfo);
            }
            return Result<UserRegisterData>.Fail($"couldn't find nickname by id {id}");
        }
    }
}
