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
    setIsFilterOpen(false);
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-transparent rounded-lg p-4 mb-6">
      {/* Search Bar with Integrated Filter Icon */}
      <div className="relative">
        {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="input-field pr-12"
        />

        {/* Filter Icon inside input */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-gray-600 hover:text-primary-600 transition-colors p-1"
          >
            <Filter className="h-5 w-5" />
          </button>

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </div>
      </div>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className="mt-4 p-4 bg-gray rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label> */}
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
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price ($)
              </label> */}
              <input
                type="number"
                placeholder="Min Price ($)"
                min="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="input-field"
              />
            </div>

            {/* Max Price */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price ($)
              </label> */}
              <input
                type="number"
                placeholder="Max Price ($)"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {activeFiltersCount > 0
                ? `${activeFiltersCount} filter${
                    activeFiltersCount === 1 ? "" : "s"
                  } applied`
                : "No filters applied"}
            </span>

            <div className="flex space-x-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                // disabled={activeFiltersCount === 0}
              >
                Clear
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
