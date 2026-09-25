using Microsoft.AspNetCore.Mvc;
using Server.Application.ResultApi;

namespace Server.Application.Services
{
    public record UserRegisterData(string Nickname, bool IsSpectator);
    public class RegisterService
    {
        private readonly Dictionary<Guid, UserRegisterData> _users = new Dictionary<Guid, UserRegisterData>();
        public Dictionary<Guid, UserRegisterData> RegisteredUsers => _users;
        public bool CanRegistrationOverride { private get; set; } = false;
        public Result<Guid> Register(string nickname, bool isSpectator)
        {
            var id = Guid.NewGuid();
            if (_users.Values.FirstOrDefault(x=>x.Nickname == nickname) != null)
            {
                if (!CanRegistrationOverride)
                    return Result<Guid>.Fail($"Nickname {nickname} already in use");
                _users.Remove(_users.First(x => x.Value.Nickname == nickname).Key);
            }
            _users.Add(id, new UserRegisterData(nickname, isSpectator));
            return Result<Guid>.Ok(id);
        }
        public Result<UserRegisterData> GetUserRegisterInfoById(Guid? id)
        {
            if (id == null)
                return Result<UserRegisterData>.Fail("Id is null");
            if(_users.TryGetValue((Guid)id, out var userInfo))
            {
                return Result<UserRegisterData>.Ok(userInfo);
            }
            return Result<UserRegisterData>.Fail($"couldn't find nickname by id {id}");
        }
    }
}
