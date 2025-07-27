"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, Users, ChefHat } from "lucide-react";

interface Ingredient {
  id: string;
  quantity: number;
  unit: string;
  food: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Recipe {
  id: string;
  name: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  difficulty?: string;
  category?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  user: {
    name?: string;
  };
}

export function RecipeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("q", searchQuery);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      const response = await fetch(`/api/recipes?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json() as Promise<Recipe[]>;
    },
  });

  const categories = ["breakfast", "lunch", "dinner", "snack"];
  const difficulties = ["easy", "medium", "hard"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calculateTotalNutrition = (ingredients: Ingredient[]) => {
    return ingredients.reduce(
      (acc, ingredient) => ({
        calories: acc.calories + (ingredient.food.calories * ingredient.quantity) / ingredient.food.servingSize,
        protein: acc.protein + (ingredient.food.protein * ingredient.quantity) / ingredient.food.servingSize,
        carbs: acc.carbs + (ingredient.food.carbs * ingredient.quantity) / ingredient.food.servingSize,
        fat: acc.fat + (ingredient.food.fat * ingredient.quantity) / ingredient.food.servingSize,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes?.map((recipe) => {
            const nutrition = calculateTotalNutrition(recipe.ingredients);
            return (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                {recipe.imageUrl && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{recipe.name}</CardTitle>
                  {recipe.description && (
                    <CardDescription>{recipe.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {(recipe.prepTime || recipe.cookTime) && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {recipe.prepTime && `${recipe.prepTime}m prep`}
                          {recipe.prepTime && recipe.cookTime && " + "}
                          {recipe.cookTime && `${recipe.cookTime}m cook`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                    {recipe.difficulty && (
                      <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            recipe.difficulty
                          )}`}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Calories:</span>{" "}
                      {Math.round(nutrition.calories)}
                    </div>
                    <div>
                      <span className="font-medium">Protein:</span>{" "}
                      {Math.round(nutrition.protein)}g
                    </div>
                    <div>
                      <span className="font-medium">Carbs:</span>{" "}
                      {Math.round(nutrition.carbs)}g
                    </div>
                    <div>
                      <span className="font-medium">Fat:</span>{" "}
                      {Math.round(nutrition.fat)}g
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {recipe.ingredients.length} ingredients
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {recipes?.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No recipes found. Try a different search term or add a new recipe.
        </div>
      )}
    </div>
  );
} 