using System.ComponentModel.DataAnnotations;

namespace interway.Models
{
    public class Product
    {
        private int _id;
        private string _name = string.Empty;
        private string? _description;
        private decimal _price;
        private int _quantityInStock;
        private string? _category;
        private string? _imageUrl;

        public int Id
        {
            get => _id;
            set => _id = value;
        }

        [Required]
        public string Name
        {
            get => _name;
            set => _name = value;
        }

        public string? Description
        {
            get => _description;
            set => _description = value;
        }

        [Range(0, double.MaxValue)]
        public decimal Price
        {
            get => _price;
            set => _price = value;
        }

        [Range(0, int.MaxValue)]
        public int QuantityInStock
        {
            get => _quantityInStock;
            set => _quantityInStock = value;
        }

        public string? Category
        {
            get => _category;
            set => _category = value;
        }

        public string? ImageUrl
        {
            get => _imageUrl;
            set => _imageUrl = value;
        }
    }


}
