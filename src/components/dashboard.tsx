"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodSearch } from "@/components/food-search";
import { RecipeList } from "@/components/recipe-list";
import { MealPlanCalendar } from "@/components/meal-plan-calendar";
import { NutritionOverview } from "@/components/nutrition-overview";

export function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">NutriTrack Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.name}
                </span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "foods", label: "Food Database" },
              { id: "recipes", label: "Recipes" },
              { id: "meal-plans", label: "Meal Plans" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,850</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protein (g)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbs (g)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">220</div>
                  <p className="text-xs text-muted-foreground">
                    +12.3% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fat (g)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65</div>
                  <p className="text-xs text-muted-foreground">
                    +8.1% from last week
                  </p>
                </CardContent>
              </Card>
            </div>
            <NutritionOverview />
            <MealPlanCalendar />
          </div>
        )}

        {activeTab === "foods" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Food Database</CardTitle>
                <CardDescription>
                  Search and manage your food items and nutritional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FoodSearch />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "recipes" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipes</CardTitle>
                <CardDescription>
                  Create and manage your recipe collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecipeList />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "meal-plans" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meal Plans</CardTitle>
                <CardDescription>
                  Plan your meals and track your nutrition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MealPlanCalendar />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
} 