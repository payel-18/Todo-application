using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace TodoApi.Models
{
    public class Todo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } // MongoDB unique identifier

        public string UserId { get; set; } // ID of the user who created the todo
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }

        [BsonElement("Status")]
        public string Status { get; set; } = "Pending"; // Default status

        [BsonIgnore]
        public string StringId => Id.ToString(); // Convenience string version of Id
    }

    // DTO for updating a Todo
    public class UpdateTodoDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public bool? IsCompleted { get; set; }
        public string Status { get; set; }
    }
}
