using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using TodoApi.Models;

namespace TodoApi.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            var database = client.GetDatabase(config["MongoDB:Database"]);
            _users = database.GetCollection<User>(config["MongoDB:UserCollection"]);

            // Create unique index on username
            var indexOptions = new CreateIndexOptions { Unique = true };
            var indexKeys = Builders<User>.IndexKeys.Ascending(u => u.Username);
            _users.Indexes.CreateOne(new CreateIndexModel<User>(indexKeys, indexOptions));
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }
    }
}