using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApi.Models;
using TodoApi.Repositories;
using FluentValidation;
using MongoDB.Bson;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TodosController : ControllerBase
    {
        private readonly TodoRepository _todoRepository;
        private readonly IValidator<Todo> _validator;

        public TodosController(TodoRepository todoRepository, IValidator<Todo> validator)
        {
            _todoRepository = todoRepository;
            _validator = validator;
        }

        // Create a new todo
        [HttpPost]
        public async Task<IActionResult> CreateTodo([FromBody] Todo todo)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("User not authenticated");

            todo.UserId = userId;
            todo.CreatedAt = DateTime.UtcNow;

            if (string.IsNullOrEmpty(todo.Status))
                todo.Status = "Pending";

            var result = await _validator.ValidateAsync(todo);
            if (!result.IsValid)
                return BadRequest(result.Errors.Select(e => e.ErrorMessage));

            var newTodo = await _todoRepository.CreateTodoAsync(todo);
            return Ok(newTodo);
        }

        // Get a single todo by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTodo(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid ID");

            var todo = await _todoRepository.GetTodoAsync(id, userId);
            if (todo == null)
                return NotFound("Todo not found");

            return Ok(todo);
        }

        // Update a todo
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(string id, [FromBody] UpdateTodoDto updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid ID");

            var todo = await _todoRepository.GetTodoAsync(id, userId);
            if (todo == null)
                return NotFound("Todo not found");

            if (updateDto.Title != null) todo.Title = updateDto.Title;
            if (updateDto.Description != null) todo.Description = updateDto.Description;
            if (updateDto.IsCompleted.HasValue) todo.IsCompleted = updateDto.IsCompleted.Value;
            if (updateDto.Status != null) todo.Status = updateDto.Status;

            todo.UserId = userId;

            var result = await _validator.ValidateAsync(todo);
            if (!result.IsValid)
                return BadRequest(result.Errors.Select(e => e.ErrorMessage));

            var updatedTodo = await _todoRepository.UpdateTodoAsync(id, todo);
            return updatedTodo != null ? Ok(updatedTodo) : NotFound("Todo not found");
        }

        // Delete a todo
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid ID");

            var todo = await _todoRepository.GetTodoAsync(id, userId);
            if (todo == null)
                return NotFound("Todo not found");

            await _todoRepository.DeleteTodoAsync(id, userId);
            return NoContent();
        }

        // Get all todos
        [HttpGet]
        public async Task<IActionResult> GetTodos([FromQuery] bool? isCompleted, [FromQuery] string sortBy)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var todos = await _todoRepository.GetTodosAsync(userId, isCompleted, sortBy);
            return Ok(new { data = todos });
        }
    }
}
