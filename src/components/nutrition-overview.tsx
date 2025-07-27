"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const nutritionData = [
  { name: "Protein", value: 85, color: "#3B82F6" },
  { name: "Carbs", value: 220, color: "#10B981" },
  { name: "Fat", value: 65, color: "#F59E0B" },
];

const weeklyData = [
  { day: "Mon", calories: 1850, protein: 85, carbs: 220, fat: 65 },
  { day: "Tue", calories: 1920, protein: 90, carbs: 230, fat: 68 },
  { day: "Wed", calories: 1780, protein: 82, carbs: 210, fat: 62 },
  { day: "Thu", calories: 1950, protein: 88, carbs: 235, fat: 70 },
  { day: "Fri", calories: 1880, protein: 86, carbs: 225, fat: 66 },
  { day: "Sat", calories: 2100, protein: 95, carbs: 250, fat: 75 },
  { day: "Sun", calories: 2000, protein: 92, carbs: 240, fat: 72 },
];

const macroBreakdown = [
  { name: "Protein", value: 340, color: "#3B82F6" },
  { name: "Carbs", value: 880, color: "#10B981" },
  { name: "Fat", value: 585, color: "#F59E0B" },
];

export function NutritionOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Nutrition Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Nutrition Trends</CardTitle>
          <CardDescription>
            Your daily macronutrient intake over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="protein" fill="#3B82F6" name="Protein (g)" />
              <Bar dataKey="carbs" fill="#10B981" name="Carbs (g)" />
              <Bar dataKey="fat" fill="#F59E0B" name="Fat (g)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Macro Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Macro Breakdown</CardTitle>
          <CardDescription>
            Distribution of macronutrients in your diet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {macroBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {macroBreakdown.map((macro) => (
              <div key={macro.name} className="space-y-1">
                <div className="text-sm font-medium">{macro.name}</div>
                <div className="text-2xl font-bold" style={{ color: macro.color }}>
                  {macro.value}g
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Nutrition Summary</CardTitle>
          <CardDescription>
            Overview of your current nutrition status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,850</div>
              <div className="text-sm text-gray-600">Daily Calories</div>
              <div className="text-xs text-green-600">+2.1% from goal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85g</div>
              <div className="text-sm text-gray-600">Protein</div>
              <div className="text-xs text-green-600">+5.2% from goal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">220g</div>
              <div className="text-sm text-gray-600">Carbohydrates</div>
              <div className="text-xs text-green-600">+12.3% from goal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">65g</div>
              <div className="text-sm text-gray-600">Fat</div>
              <div className="text-xs text-green-600">+8.1% from goal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 