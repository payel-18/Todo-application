using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;
using TodoApi.Repositories;
using FluentValidation;
using MongoDB.Bson;
using System.Security.Cryptography;
using System.Text;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserRepository _userRepo;
        private readonly IValidator<User> _validator;

        public AuthController(AuthService authService, UserRepository userRepo, IValidator<User> validator)
        {
            _authService = authService;
            _userRepo = userRepo;
            _validator = validator;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var validation = await _validator.ValidateAsync(user);
            if (!validation.IsValid)
            {
                return BadRequest(new
                {
                    Message = "Validation failed",
                    Errors = validation.Errors
                });
            }

            var existingUser = await _userRepo.GetUserByUsernameAsync(user.Username);
            if (existingUser != null)
                return BadRequest(new { Message = "Username already exists" });

            user.Id = ObjectId.GenerateNewId().ToString();
            user.PasswordHash = HashPassword(user.Password);

            await _userRepo.CreateUserAsync(user);
            return Ok(new { Message = "Registration successful" });
        }

        // Login user and return JWT token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepo.GetUserByUsernameAsync(request.Username);
            if (user == null || HashPassword(request.Password) != user.PasswordHash)
                return Unauthorized(new { Message = "Invalid credentials" });

            var token = _authService.GenerateToken(user);
            return Ok(new { Message = "Login successful", Token = token });
        }

        // Hash the password using SHA256
        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        // Data model for login
        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}
