import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecipe } from "../hooks/useRecipes";
import { recipeService } from "../utils/api";
import { toast } from "../components/Toast";
import "./RecipePage.css";

const DIFFICULTY_COLOR = { łatwy: "badge-difficulty-łatwy", średni: "badge-difficulty-średni", trudny: "badge-difficulty-trudny" };

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipe, loading, error } = useRecipe(id);

  const [servings, setServings] = useState(null);
  const [scaledIngredients, setScaledIngredients] = useState(null);
  const [scaling, setScaling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (recipe) setServings(recipe.defaultServings);
  }, [recipe]);

  const handleScale = async (newServings) => {
    if (!recipe || newServings < 1) return;
    setServings(newServings);
    if (newServings === recipe.defaultServings) {
      setScaledIngredients(null);
      return;
    }
    setScaling(true);
    try {
      const { data } = await recipeService.scale(id, newServings);
      setScaledIngredients(data.scaledIngredients);
    } catch {
      toast("Błąd skalowania porcji", "error");
    } finally {
      setScaling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await recipeService.delete(id);
      toast("Przepis usunięty");
      navigate("/");
    } catch {
      toast("Błąd usuwania przepisu", "error");
      setDeleting(false);
    }
  };

  const displayIngredients = scaledIngredients || recipe?.ingredients;
  const totalTime = recipe ? (recipe.prepTime || 0) + (recipe.cookTime || 0) : 0;

  if (loading) return (
    <div className="recipe-page-loading">
      <div className="spinner"></div>
    </div>
  );

  if (error || !recipe) return (
    <div className="recipe-page-error">
      <p>⚠️ {error || "Przepis nie znaleziony"}</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>← Wróć do listy</Link>
    </div>
  );

  return (
    <div className="recipe-page fade-in">
      {/* Hero */}
      <div className="recipe-hero">
        {recipe.image && (
          <div className="recipe-hero-image">
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipe-hero-overlay" />
          </div>
        )}
        <div className={`recipe-hero-content container ${recipe.image ? "has-image" : ""}`}>
          <Link to="/" className="back-link">← Przepisy</Link>
          <div className="recipe-hero-badges">
            {recipe.difficulty && (
              <span className={`badge ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.categories?.map((cat) => (
              <span key={cat} className="badge badge-category">{cat}</span>
            ))}
          </div>
          <h1 className="recipe-title">{recipe.title}</h1>
          {recipe.description && <p className="recipe-description">{recipe.description}</p>}

          <div className="recipe-meta-row">
            {recipe.prepTime > 0 && (
              <div className="recipe-meta-item">
                <span className="meta-icon">🥣</span>
                <div>
                  <div className="meta-label">Przygotowanie</div>
                  <div className="meta-value">{recipe.prepTime} min</div>
                </div>
              </div>
            )}
            {recipe.cookTime > 0 && (
              <div className="recipe-meta-item">
                <span className="meta-icon">🔥</span>
                <div>
                  <div className="meta-label">Gotowanie</div>
                  <div className="meta-value">{recipe.cookTime} min</div>
                </div>
              </div>
            )}
            {totalTime > 0 && (
              <div className="recipe-meta-item">
                <span className="meta-icon">⏱</span>
                <div>
                  <div className="meta-label">Łącznie</div>
                  <div className="meta-value">{totalTime} min</div>
                </div>
              </div>
            )}
            <div className="recipe-meta-item">
              <span className="meta-icon">👥</span>
              <div>
                <div className="meta-label">Porcje</div>
                <div className="meta-value">{recipe.defaultServings}</div>
              </div>
            </div>
          </div>

          <div className="recipe-actions">
            <Link to={`/edit/${recipe._id}`} className="btn btn-primary">✏️ Edytuj</Link>
            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              🗑 Usuń
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container recipe-body">
        {/* Skalowanie porcji */}
        <div className="servings-scaler card">
          <h3 className="scaler-title">🍽️ Kalkulator porcji</h3>
          <p className="scaler-desc">Domyślna liczba porcji: <strong>{recipe.defaultServings}</strong></p>
          <div className="scaler-controls">
            <button className="scaler-btn" onClick={() => handleScale(Math.max(1, servings - 1))} disabled={servings <= 1}>−</button>
            <input
              type="number" min={1} className="scaler-input"
              value={servings}
              onChange={(e) => handleScale(Math.max(1, Number(e.target.value)))}
            />
            <button className="scaler-btn" onClick={() => handleScale(servings + 1)}>+</button>
            {servings !== recipe.defaultServings && (
              <button className="btn btn-ghost btn-sm" onClick={() => handleScale(recipe.defaultServings)}>
                Reset
              </button>
            )}
          </div>
          {servings !== recipe.defaultServings && (
            <p className="scaler-note">
              Składniki przeliczone dla <strong>{servings}</strong> porcji
              {scaling && " ⟳"}
            </p>
          )}
        </div>

        <div className="recipe-columns">
          {/* Składniki */}
          <aside className="recipe-ingredients-col">
            <h2 className="section-title">Składniki</h2>
            <ul className="ingredients-ul">
              {displayIngredients?.map((ing, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-dot" />
                  <span className="ingredient-amount">
                    {ing.amount} {ing.unit}
                  </span>
                  <span className="ingredient-name">{ing.name}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Kroki */}
          <main className="recipe-steps-col">
            {recipe.steps?.filter(Boolean).length > 0 && (
              <>
                <h2 className="section-title">Przygotowanie</h2>
                <ol className="steps-ol">
                  {recipe.steps.filter(Boolean).map((step, i) => (
                    <li key={i} className="step-item">
                      <span className="step-num">{i + 1}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Usunąć przepis?</h3>
            <p className="modal-text">Tej operacji nie można cofnąć. Przepis <strong>"{recipe.title}"</strong> zostanie trwale usunięty.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Anuluj</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Usuwanie..." : "Tak, usuń"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
