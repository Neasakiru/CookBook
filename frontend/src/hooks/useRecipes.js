import { useState, useEffect, useCallback } from "react";
import { recipeService } from "../utils/api";

export const useRecipes = (params = {}) => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await recipeService.getAll(params);
      setRecipes(data.recipes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Błąd pobierania przepisów");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { recipes, pagination, loading, error, refetch: fetch };
};

export const useRecipe = (id) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    recipeService.getById(id)
      .then(({ data }) => setRecipe(data))
      .catch((err) => setError(err.response?.data?.message || "Błąd pobierania przepisu"))
      .finally(() => setLoading(false));
  }, [id]);

  return { recipe, loading, error, setRecipe };
};
