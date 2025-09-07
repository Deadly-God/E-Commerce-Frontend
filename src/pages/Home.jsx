import { useState, useEffect, useCallback } from "react";
import { itemsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import LoadingSpinner from "../components/LoadingSpinner";
import { Package } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await itemsAPI.getAll(params);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce API calls

    return () => clearTimeout(debounceTimer);
  }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Amazing Products
        </h1>
        <p className="text-gray-600">
          Find everything you need at unbeatable prices
        </p>
      </div>

      <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={fetchProducts}
            className="ml-4 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {loading ? "Searching..." : `${products.length} products found`}
        </p>
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() =>
              setFilters({
                search: "",
                category: "",
                minPrice: "",
                maxPrice: "",
              })
            }
            className="btn-primary"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="mt-8">
          <LoadingSpinner size="sm" text="Updating results..." />
        </div>
      )}
    </div>
  );
};

export default Home;
