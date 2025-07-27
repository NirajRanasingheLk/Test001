"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: number;
  servingUnit: string;
  isCustom: boolean;
}

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: foods, isLoading } = useQuery({
    queryKey: ["foods", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("q", searchQuery);
      }
      const response = await fetch(`/api/foods?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch foods");
      }
      return response.json() as Promise<FoodItem[]>;
    },
    enabled: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Food
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods?.map((food) => (
            <Card key={food.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{food.name}</CardTitle>
                {food.brand && (
                  <CardDescription>{food.brand}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Calories:</span> {food.calories}
                  </div>
                  <div>
                    <span className="font-medium">Protein:</span> {food.protein}g
                  </div>
                  <div>
                    <span className="font-medium">Carbs:</span> {food.carbs}g
                  </div>
                  <div>
                    <span className="font-medium">Fat:</span> {food.fat}g
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Serving: {food.servingSize} {food.servingUnit}
                </div>
                {food.isCustom && (
                  <div className="text-xs text-blue-600 font-medium">
                    Custom Food
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {foods?.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No foods found. Try a different search term or add a new food item.
        </div>
      )}
    </div>
  );
} 