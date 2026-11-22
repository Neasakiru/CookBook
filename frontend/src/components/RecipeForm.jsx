import { useState } from "react";
import "./RecipeForm.css";

const DIFFICULTIES = ["łatwy", "średni", "trudny"];

const emptyIngredient = () => ({ name: "", amount: "", unit: "" });
const emptyForm = {
  title: "", description: "", categories: [],
  ingredients: [emptyIngredient()],
  steps: [""],
  defaultServings: 4,
  prepTime: 0, cookTime: 0,
  difficulty: "średni", image: "",
};

export default function RecipeForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...initialData,
          categories: initialData.categories || [],
          ingredients: initialData.ingredients?.length ? initialData.ingredients : [emptyIngredient()],
          steps: initialData.steps?.length ? initialData.steps : [""],
        }
      : emptyForm
  );
  const [categoryInput, setCategoryInput] = useState("");
  const [errors, setErrors] = useState({});

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  // Ingredients
  const setIngredient = (i, field, value) => {
    const updated = [...form.ingredients];
    updated[i] = { ...updated[i], [field]: value };
    set("ingredients", updated);
  };
  const addIngredient = () => set("ingredients", [...form.ingredients, emptyIngredient()]);
  const removeIngredient = (i) => set("ingredients", form.ingredients.filter((_, idx) => idx !== i));

  // Steps
  const setStep = (i, value) => {
    const updated = [...form.steps];
    updated[i] = value;
    set("steps", updated);
  };
  const addStep = () => set("steps", [...form.steps, ""]);
  const removeStep = (i) => set("steps", form.steps.filter((_, idx) => idx !== i));

  // Categories
  const addCategory = () => {
    const cat = categoryInput.trim();
    if (cat && !form.categories.includes(cat)) {
      set("categories", [...form.categories, cat]);
    }
    setCategoryInput("");
  };
  const removeCategory = (cat) => set("categories", form.categories.filter((c) => c !== cat));

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Tytuł jest wymagany";
    if (!form.defaultServings || form.defaultServings < 1) errs.defaultServings = "Min. 1 porcja";
    const validIngs = form.ingredients.filter((i) => i.name.trim() && i.amount !== "");
    if (validIngs.length === 0) errs.ingredients = "Dodaj przynajmniej jeden składnik";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const payload = {
      ...form,
      ingredients: form.ingredients.filter((i) => i.name.trim() && i.amount !== "").map((i) => ({
        ...i, amount: Number(i.amount),
      })),
      steps: form.steps.filter((s) => s.trim()),
      defaultServings: Number(form.defaultServings),
      prepTime: Number(form.prepTime) || 0,
      cookTime: Number(form.cookTime) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {/* Podstawowe info */}
      <section className="form-section">
        <h2 className="form-section-title">Podstawowe informacje</h2>
        <div className="form-grid-2">
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Tytuł przepisu *</label>
            <input
              className={`form-input ${errors.title ? "form-input-error" : ""}`}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="np. Risotto grzybowe"
              maxLength={120}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Opis (opcjonalny)</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Krótki opis przepisu..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trudność</label>
            <select className="form-select" value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Link do zdjęcia (opcjonalny)</label>
            <input
              className="form-input"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      {/* Czas i porcje */}
      <section className="form-section">
        <h2 className="form-section-title">Czas i porcje</h2>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Czas przygotowania (min)</label>
            <input type="number" className="form-input" min={0}
              value={form.prepTime} onChange={(e) => set("prepTime", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Czas gotowania (min)</label>
            <input type="number" className="form-input" min={0}
              value={form.cookTime} onChange={(e) => set("cookTime", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Domyślna liczba porcji *</label>
            <input type="number" className={`form-input ${errors.defaultServings ? "form-input-error" : ""}`}
              min={1} value={form.defaultServings} onChange={(e) => set("defaultServings", e.target.value)} />
            {errors.defaultServings && <span className="form-error">{errors.defaultServings}</span>}
          </div>
        </div>
      </section>

      {/* Kategorie */}
      <section className="form-section">
        <h2 className="form-section-title">Kategorie</h2>
        <div className="category-input-row">
          <input
            className="form-input"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
            placeholder="np. Wegetariańskie, Włoska kuchnia..."
          />
          <button type="button" className="btn btn-ghost" onClick={addCategory}>Dodaj</button>
        </div>
        {form.categories.length > 0 && (
          <div className="category-chips">
            {form.categories.map((cat) => (
              <span key={cat} className="category-chip">
                {cat}
                <button type="button" onClick={() => removeCategory(cat)}>×</button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Składniki */}
      <section className="form-section">
        <h2 className="form-section-title">Składniki</h2>
        {errors.ingredients && <p className="form-error" style={{ marginBottom: 12 }}>{errors.ingredients}</p>}
        <div className="ingredients-list">
          <div className="ingredients-header">
            <span>Nazwa</span><span>Ilość</span><span>Jednostka</span><span></span>
          </div>
          {form.ingredients.map((ing, i) => (
            <div key={i} className="ingredient-row">
              <input className="form-input" placeholder="np. Ryż arborio"
                value={ing.name} onChange={(e) => setIngredient(i, "name", e.target.value)} />
              <input className="form-input" type="number" min={0} step="any" placeholder="250"
                value={ing.amount} onChange={(e) => setIngredient(i, "amount", e.target.value)} />
              <input className="form-input" placeholder="g, ml, szt..."
                value={ing.unit} onChange={(e) => setIngredient(i, "unit", e.target.value)} />
              <button type="button" className="btn btn-ghost btn-sm remove-btn"
                onClick={() => removeIngredient(i)} disabled={form.ingredients.length === 1}>
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={addIngredient} style={{ marginTop: 10 }}>
          + Dodaj składnik
        </button>
      </section>

      {/* Kroki */}
      <section className="form-section">
        <h2 className="form-section-title">Kroki przygotowania</h2>
        <div className="steps-list">
          {form.steps.map((step, i) => (
            <div key={i} className="step-row">
              <span className="step-number">{i + 1}</span>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder={`Krok ${i + 1}...`}
                value={step}
                onChange={(e) => setStep(i, e.target.value)}
              />
              <button type="button" className="btn btn-ghost btn-sm remove-btn"
                onClick={() => removeStep(i)} disabled={form.steps.length === 1}>
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={addStep} style={{ marginTop: 10 }}>
          + Dodaj krok
        </button>
      </section>

      {/* Submit */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? "Zapisywanie..." : initialData ? "Zapisz zmiany" : "Dodaj przepis"}
        </button>
      </div>
    </form>
  );
}
