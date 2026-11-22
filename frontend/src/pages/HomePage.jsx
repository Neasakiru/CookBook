import { useState, useEffect } from "react";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import { recipeService } from "../utils/api";
import "./HomePage.css";

const DIFFICULTIES = ["łatwy", "średni", "trudny"];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    recipeService.getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const params = {};
  if (debouncedSearch) params.search = debouncedSearch;
  if (category) params.category = category;
  if (difficulty) params.difficulty = difficulty;

  const { recipes, pagination, loading, error } = useRecipes(params);

  return (
    <div className="home-page">
      <div className="container">
        <header className="home-header">
          <div className="home-header-text">
            <h1 className="home-title">Przepisy kulinarne</h1>
            <p className="home-subtitle">Twoja domowa kolekcja smaków</p>
          </div>
          {pagination && (
            <span className="home-count">{pagination.total} przepisów</span>
          )}
        </header>

        {/* Filtry */}
        <div className="home-filters">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              className="form-input search-input"
              placeholder="Szukaj przepisu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
          {categories.length > 0 && (
            <select className="form-select filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Wszystkie kategorie</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select className="form-select filter-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Każda trudność</option>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {(search || category || difficulty) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setCategory(""); setDifficulty(""); }}>
              Wyczyść filtry
            </button>
          )}
        </div>

        {/* Treść */}
        {loading && (
          <div className="home-loading">
            <div className="spinner"></div>
            <span>Ładowanie przepisów...</span>
          </div>
        )}

        {error && (
          <div className="home-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="home-empty">
            <span className="home-empty-icon">🍽️</span>
            <h2>Brak przepisów</h2>
            <p>{search || category || difficulty ? "Spróbuj innych filtrów." : "Dodaj swój pierwszy przepis!"}</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="recipes-grid fade-in">
            {recipes.map((r) => <RecipeCard key={r._id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
