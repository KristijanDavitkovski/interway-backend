using interway.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace interway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly InventoryDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProductsController(InventoryDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll(string? search, string? category, int page = 1, int pageSize = 10)
    {
        var query = _context.Products.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search));

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category == category);

        var total = await query.CountAsync();
        var data = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, data });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> Get(int id) =>
        await _context.Products.FindAsync(id) is Product product
            ? Ok(product)
            : NotFound();

    [HttpPost]
    public async Task<ActionResult> Create([FromForm] Product product, IFormFile? image)
    {
        if (product.Price == 0 || product.QuantityInStock == 0) return BadRequest();
        if (image != null)
        {
            var path = Path.Combine(_env.WebRootPath, "images", image.FileName);
            using var stream = System.IO.File.Create(path);
            await image.CopyToAsync(stream);
            product.ImageUrl = $"images/{image.FileName}";
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] Product updated)
    {
        if (updated.Price == 0 || updated.QuantityInStock == 0) return BadRequest();
        var existing = await _context.Products.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        // Update fields manually
        existing.Name = updated.Name;
        existing.Description = updated.Description;
        existing.Price = updated.Price;
        existing.QuantityInStock = updated.QuantityInStock;
        existing.Category = updated.Category;

        // If you're also receiving a new image, handle it here
        if (Request.Form.Files.Count > 0)
        {
            var file = Request.Form.Files[0];
            // Save file to disk or storage, e.g. wwwroot/images/
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine("wwwroot/images", fileName);
            var directory = Path.GetDirectoryName(filePath);

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update image path in DB
            existing.ImageUrl = "images/" + fileName;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
