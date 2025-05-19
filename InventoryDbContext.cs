using interway.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace interway
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
    }

}
