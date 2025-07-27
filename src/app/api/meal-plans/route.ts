import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mealPlanSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let whereClause: any = {
      createdBy: session.user.id,
    };

    if (startDate && endDate) {
      whereClause.OR = [
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
      ];
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: {
                    food: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { date: "asc" },
            { mealType: "asc" },
          ],
        },
      },
      orderBy: [
        { startDate: "desc" },
      ],
    });

    return NextResponse.json(mealPlans);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
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
    const validatedData = mealPlanSchema.parse(body);

    const { items, ...mealPlanData } = validatedData;

    const mealPlan = await prisma.mealPlan.create({
      data: {
        ...mealPlanData,
        createdBy: session.user.id,
        items: {
          create: items.map((item) => ({
            date: item.date,
            mealType: item.mealType,
            recipeId: item.recipeId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: {
                    food: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(mealPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
} 