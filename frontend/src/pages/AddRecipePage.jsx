import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { recipeService } from "../utils/api";
import { toast } from "../components/Toast";
import "./FormPage.css";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: created } = await recipeService.create(data);
      toast("Przepis dodany pomyślnie! 🎉");
      navigate(`/recipe/${created._id}`);
    } catch (err) {
      const msg = err.response?.data?.errors?.join(", ") || err.response?.data?.message || "Błąd dodawania przepisu";
      toast(msg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-page-header">
          <Link to="/" className="back-link-page">← Wróć do listy</Link>
          <h1 className="form-page-title">Nowy przepis</h1>
          <p className="form-page-subtitle">Uzupełnij poniższe pola, aby dodać przepis do kolekcji</p>
        </div>
        <div className="form-card card">
          <RecipeForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
