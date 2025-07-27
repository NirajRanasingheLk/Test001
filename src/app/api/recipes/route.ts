import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recipeSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");

    let whereClause: any = {
      OR: [
        { isPublic: true }, // Public recipes
        { isPublic: false, createdBy: session.user.id }, // User's private recipes
      ],
    };

    if (query) {
      whereClause.AND = [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        ingredients: {
          include: {
            food: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { isPublic: "asc" }, // Private recipes first
        { name: "asc" },
      ],
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = recipeSchema.parse(body);

    const { ingredients, ...recipeData } = validatedData;

    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        createdBy: session.user.id,
        ingredients: {
          create: ingredients.map((ingredient) => ({
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            foodId: ingredient.foodId,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
} 