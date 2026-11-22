import { Link } from "react-router-dom";
import "./RecipeCard.css";

const DIFFICULTY_EMOJI = { łatwy: "🟢", średni: "🟡", trudny: "🔴" };

export default function RecipeCard({ recipe }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card card">
      <div className="recipe-card-image">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="recipe-card-placeholder">
            <span>🍽️</span>
          </div>
        )}
        {recipe.difficulty && (
          <span className={`recipe-card-difficulty badge badge-difficulty-${recipe.difficulty}`}>
            {DIFFICULTY_EMOJI[recipe.difficulty]} {recipe.difficulty}
          </span>
        )}
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.description && (
          <p className="recipe-card-desc">{recipe.description}</p>
        )}
        <div className="recipe-card-meta">
          {totalTime > 0 && (
            <span className="recipe-card-meta-item">
              ⏱ {totalTime} min
            </span>
          )}
          <span className="recipe-card-meta-item">
            👥 {recipe.defaultServings} porcji
          </span>
        </div>
        {recipe.categories?.length > 0 && (
          <div className="recipe-card-categories">
            {recipe.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="badge badge-category">{cat}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
