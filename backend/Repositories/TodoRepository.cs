using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApi.Models;

namespace TodoApi.Repositories
{
    public class TodoRepository
    {
        private readonly IMongoCollection<Todo> _todos;

        // Connect to MongoDB using config values
        public TodoRepository(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            var database = client.GetDatabase(config["MongoDB:Database"]);
            _todos = database.GetCollection<Todo>(config["MongoDB:TodoCollection"]);
        }

        // Get todos for a user (with optional filters and sorting)
        public async Task<List<Todo>> GetTodosAsync(string userId, bool? isCompleted, string sortBy)
        {
            var filter = Builders<Todo>.Filter.Eq(t => t.UserId, userId);

            if (isCompleted.HasValue)
            {
                filter &= Builders<Todo>.Filter.Eq(t => t.IsCompleted, isCompleted.Value);
            }

            var sort = Builders<Todo>.Sort.Descending(sortBy ?? "CreatedAt");
            return await _todos.Find(filter).Sort(sort).ToListAsync();
        }

        // Get a single todo by ID and user
        public async Task<Todo> GetTodoAsync(string id, string userId)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
                return null;

            return await _todos.Find(t => t.Id == objectId && t.UserId == userId).FirstOrDefaultAsync();
        }

        // Create a new todo
        public async Task<Todo> CreateTodoAsync(Todo todo)
        {
            todo.Id = ObjectId.GenerateNewId();
            await _todos.InsertOneAsync(todo);
            return todo;
        }

        // Update a todo by ID
        public async Task<Todo> UpdateTodoAsync(string id, Todo updatedTodo)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
                return null;

            var filter = Builders<Todo>.Filter.Eq(t => t.Id, objectId) & Builders<Todo>.Filter.Eq(t => t.UserId, updatedTodo.UserId);
            var options = new FindOneAndReplaceOptions<Todo> { ReturnDocument = ReturnDocument.After };

            return await _todos.FindOneAndReplaceAsync(filter, updatedTodo, options);
        }

        // Delete a todo by ID and user
        public async Task DeleteTodoAsync(string id, string userId)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
                return;

            await _todos.DeleteOneAsync(t => t.Id == objectId && t.UserId == userId);
        }
    }
}
