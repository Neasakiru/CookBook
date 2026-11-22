# 🍳 Moja Kuchnia — Aplikacja do przepisów kulinarnych

Domowa aplikacja MERN (MongoDB, Express, React, Node.js) do zarządzania przepisami.

---

## 📁 Struktura projektu

```
recipe-app/
├── backend/          # Express + Mongoose API
│   ├── models/       # Schema MongoDB
│   ├── routes/       # Endpointy API
│   ├── middleware/   # Error handler
│   ├── server.js
│   └── .env.example
└── frontend/         # React SPA
    └── src/
        ├── components/   # Navbar, RecipeCard, RecipeForm, Toast
        ├── pages/        # HomePage, RecipePage, AddRecipePage, EditRecipePage
        ├── hooks/        # useRecipes, useRecipe
        └── utils/        # api.js (axios)
```

---

## 🚀 Uruchomienie

### Wymagania
- Node.js 18+
- MongoDB (lokalnie lub Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Uzupełnij MONGODB_URI w pliku .env
npm run dev
```

Serwer działa na: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Aplikacja dostępna pod: `http://localhost:3000`

---

## 📡 API — Endpointy

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/recipes` | Lista przepisów (filtry: search, category, difficulty, page, limit) |
| GET | `/api/recipes/categories` | Lista unikalnych kategorii |
| GET | `/api/recipes/:id` | Szczegóły przepisu |
| GET | `/api/recipes/:id/scale?servings=X` | Skalowanie składników |
| POST | `/api/recipes` | Dodaj przepis |
| PUT | `/api/recipes/:id` | Edytuj przepis |
| DELETE | `/api/recipes/:id` | Usuń przepis |
| GET | `/api/health` | Status serwera |

---

## 🗄️ Schema MongoDB — Recipe

```js
{
  title: String,           // wymagany, max 120 znaków
  description: String,
  categories: [String],    // wiele kategorii
  ingredients: [{
    name: String,          // wymagany
    amount: Number,        // wymagany
    unit: String,
  }],
  steps: [String],
  defaultServings: Number, // wymagany, domyślnie 4
  prepTime: Number,        // minuty
  cookTime: Number,        // minuty
  difficulty: String,      // 'łatwy' | 'średni' | 'trudny'
  image: String,           // URL
  // timestamps: createdAt, updatedAt
  // virtual: totalTime = prepTime + cookTime
  // method: scaleIngredients(targetServings)
}
```

---

## ✨ Funkcjonalności

- ✅ CRUD — dodawanie, przeglądanie, edycja, usuwanie przepisów
- ✅ Wyszukiwanie pełnotekstowe (tytuł + opis)
- ✅ Filtrowanie po kategorii i trudności
- ✅ Kalkulator porcji — skaluje składniki dla dowolnej liczby porcji
- ✅ Wiele kategorii na przepis
- ✅ Czasy przygotowania i gotowania
- ✅ Poziom trudności
- ✅ Opcjonalne zdjęcia (link URL)
- ✅ Powiadomienia toast
- ✅ Responsywny design
