const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nazwa składnika jest wymagana"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Ilość składnika jest wymagana"],
    min: [0, "Ilość nie może być ujemna"],
  },
  unit: {
    type: String,
    trim: true,
    default: "",
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tytuł przepisu jest wymagany"],
      trim: true,
      maxlength: [120, "Tytuł nie może przekraczać 120 znaków"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Przepis musi zawierać przynajmniej jeden składnik",
      },
    },
    steps: [
      {
        type: String,
        trim: true,
      },
    ],
    defaultServings: {
      type: Number,
      required: [true, "Domyślna liczba porcji jest wymagana"],
      min: [1, "Minimalna liczba porcji to 1"],
      default: 4,
    },
    prepTime: {
      type: Number, // minuty
      min: [0, "Czas nie może być ujemny"],
      default: 0,
    },
    cookTime: {
      type: Number, // minuty
      min: [0, "Czas nie może być ujemny"],
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["łatwy", "średni", "trudny"],
      default: "średni",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: całkowity czas przygotowania
recipeSchema.virtual("totalTime").get(function () {
  return this.prepTime + this.cookTime;
});

// Metoda do skalowania składników wg porcji
recipeSchema.methods.scaleIngredients = function (targetServings) {
  const ratio = targetServings / this.defaultServings;
  return this.ingredients.map((ing) => ({
    name: ing.name,
    amount: Math.round(ing.amount * ratio * 100) / 100,
    unit: ing.unit,
  }));
};

module.exports = mongoose.model("Recipe", recipeSchema);
