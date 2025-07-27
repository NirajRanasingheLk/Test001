"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Clock } from "lucide-react";

interface MealPlanItem {
  id: string;
  date: string;
  mealType: string;
  quantity: number;
  recipe?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
  };
}

interface MealPlan {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  items: MealPlanItem[];
}

export function MealPlanCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ["meal-plans"],
    queryFn: async () => {
      const response = await fetch("/api/meal-plans");
      if (!response.ok) {
        throw new Error("Failed to fetch meal plans");
      }
      return response.json() as Promise<MealPlan[]>;
    },
  });

  const getCurrentWeekMeals = () => {
    if (!mealPlans) return [];
    
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return mealPlans.flatMap(plan => 
      plan.items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      })
    );
  };

  const getMealsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return getCurrentWeekMeals().filter(item => 
      item.date.startsWith(dateString)
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800';
      case 'lunch':
        return 'bg-green-100 text-green-800';
      case 'dinner':
        return 'bg-blue-100 text-blue-800';
      case 'snack':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(selectedDate.getDate() - 7);
              setSelectedDate(newDate);
            }}
          >
            Previous Week
          </Button>
          <h3 className="text-lg font-semibold">
            {getWeekDates()[0].toLocaleDateString()} - {getWeekDates()[6].toLocaleDateString()}
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(selectedDate.getDate() + 7);
              setSelectedDate(newDate);
            }}
          >
            Next Week
          </Button>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Meal Plan
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {getWeekDates().map((date, index) => {
          const meals = getMealsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <Card key={index} className={`min-h-32 ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {date.getDate()}
                  {isToday && <span className="ml-1 text-blue-500">•</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mealTypes.map(mealType => {
                  const meal = meals.find(m => m.mealType === mealType);
                  return (
                    <div key={mealType} className="text-xs">
                      {meal ? (
                        <div className={`p-1 rounded ${getMealTypeColor(mealType)}`}>
                          <div className="font-medium truncate">
                            {meal.recipe?.name || mealType}
                          </div>
                          {meal.quantity > 1 && (
                            <div className="text-xs opacity-75">
                              {meal.quantity}x
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-300 p-1">
                          {mealType}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading && (
        <div className="text-center py-8">Loading meal plans...</div>
      )}

      {!isLoading && mealPlans?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No meal plans found. Create your first meal plan to get started.
        </div>
      )}
    </div>
  );
} 