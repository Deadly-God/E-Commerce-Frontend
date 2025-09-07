import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { itemsAPI } from "../services/api";

const ProductFilters = ({ onFilterChange, filters }) => {
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await itemsAPI.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="md:hidden flex items-center space-x-2 text-gray-600 mb-4"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </button>

      {/* Filters */}
      <div
        className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
          isFilterOpen ? "block" : "hidden md:grid"
        }`}
      >
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price ($)
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="input-field"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price ($)
          </label>
          <input
            type="number"
            placeholder="10000"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="input-field"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button onClick={clearFilters} className="btn-secondary w-full">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
