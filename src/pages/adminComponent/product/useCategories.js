import { useState, useEffect } from "react";
import ProCatService from "../../../services/ProCatService";

export default function useCategories() {
  const [proCategories, setProCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await ProCatService.getAllCateGory();
      setProCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { proCategories, fetchCategories };
}
