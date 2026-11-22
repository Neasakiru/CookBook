import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { useRecipe } from "../hooks/useRecipes";
import { recipeService } from "../utils/api";
import { toast } from "../components/Toast";
import "./FormPage.css";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipe, loading: fetching, error } = useRecipe(id);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await recipeService.update(id, data);
      toast("Przepis zaktualizowany! ✓");
      navigate(`/recipe/${id}`);
    } catch (err) {
      const msg = err.response?.data?.errors?.join(", ") || err.response?.data?.message || "Błąd aktualizacji";
      toast(msg, "error");
      setSaving(false);
    }
  };

  if (fetching) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
      <div className="spinner"></div>
    </div>
  );

  if (error || !recipe) return (
    <div style={{ textAlign: "center", padding: "80px", color: "var(--warm-gray)" }}>
      <p>⚠️ {error || "Przepis nie znaleziony"}</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>← Wróć</Link>
    </div>
  );

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-page-header">
          <Link to={`/recipe/${id}`} className="back-link-page">← Wróć do przepisu</Link>
          <h1 className="form-page-title">Edytuj przepis</h1>
          <p className="form-page-subtitle">"{recipe.title}"</p>
        </div>
        <div className="form-card card">
          <RecipeForm initialData={recipe} onSubmit={handleSubmit} loading={saving} />
        </div>
      </div>
    </div>
  );
}
