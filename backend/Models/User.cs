using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId] 
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();  // Auto-generated ID

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;


    [BsonIgnore] // Do not store raw password in database
    public string Password { get; set; } = null!;  // Raw password to be hashed before saving

    public string PasswordHash { get; set; } = null!; // Only hashed password stored
}


