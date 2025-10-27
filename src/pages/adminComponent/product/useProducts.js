import { useState, useEffect } from "react";
import ProductService from "../../../services/ProductService";

export default function useProducts(selectedCategory) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await ProductService.getProductsPaginated(
        pageNumber,
        6,
        selectedCategory === "All" || selectedCategory === "" ? null : selectedCategory
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page, selectedCategory]);

  return {
    products,
    page,
    totalPages,
    setPage,
    fetchProducts,
    loading,
  };
}
