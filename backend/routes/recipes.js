const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// GET /api/recipes — lista wszystkich przepisów (z filtrowaniem i wyszukiwaniem)
router.get("/", async (req, res) => {
  try {
    const { search, category, difficulty, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .select("title description categories defaultServings prepTime cookTime difficulty image createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      recipes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// GET /api/recipes/categories — lista unikalnych kategorii
router.get("/categories", async (req, res) => {
  try {
    const categories = await Recipe.distinct("categories");
    res.json(categories.filter(Boolean).sort());
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// GET /api/recipes/:id — pojedynczy przepis
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Przepis nie znaleziony" });
    res.json(recipe);
  } catch (err) {
    if (err.kind === "ObjectId") return res.status(404).json({ message: "Nieprawidłowe ID" });
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// GET /api/recipes/:id/scale?servings=X — skalowanie składników
router.get("/:id/scale", async (req, res) => {
  try {
    const { servings } = req.query;
    if (!servings || isNaN(servings) || Number(servings) < 1) {
      return res.status(400).json({ message: "Podaj poprawną liczbę porcji (min. 1)" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Przepis nie znaleziony" });

    const scaledIngredients = recipe.scaleIngredients(Number(servings));

    res.json({
      recipeId: recipe._id,
      title: recipe.title,
      defaultServings: recipe.defaultServings,
      requestedServings: Number(servings),
      scaledIngredients,
    });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// POST /api/recipes — tworzenie przepisu
router.post("/", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Błąd walidacji", errors: messages });
    }
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// PUT /api/recipes/:id — aktualizacja przepisu
router.put("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) return res.status(404).json({ message: "Przepis nie znaleziony" });
    res.json(recipe);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Błąd walidacji", errors: messages });
    }
    if (err.kind === "ObjectId") return res.status(404).json({ message: "Nieprawidłowe ID" });
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// DELETE /api/recipes/:id — usuwanie przepisu
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Przepis nie znaleziony" });
    res.json({ message: "Przepis usunięty pomyślnie", id: req.params.id });
  } catch (err) {
    if (err.kind === "ObjectId") return res.status(404).json({ message: "Nieprawidłowe ID" });
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

module.exports = router;
