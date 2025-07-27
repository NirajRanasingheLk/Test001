import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchSchema, foodItemSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const validatedParams = searchSchema.parse({
      query,
      category,
      limit,
    });

    let whereClause: any = {
      OR: [
        { name: { contains: validatedParams.query, mode: "insensitive" } },
        { brand: { contains: validatedParams.query, mode: "insensitive" } },
      ],
    };

    // If it's a custom food, only show user's own foods
    if (validatedParams.query.length === 0) {
      whereClause = {
        OR: [
          { isCustom: false }, // Public foods
          { isCustom: true, createdBy: session.user.id }, // User's custom foods
        ],
      };
    }

    const foods = await prisma.foodItem.findMany({
      where: whereClause,
      take: validatedParams.limit,
      orderBy: [
        { isCustom: "asc" }, // Public foods first
        { name: "asc" },
      ],
    });

    return NextResponse.json(foods);
  } catch (error) {
    console.error("Error searching foods:", error);
    return NextResponse.json(
      { error: "Failed to search foods" },
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
    const validatedData = foodItemSchema.parse(body);

    const food = await prisma.foodItem.create({
      data: {
        ...validatedData,
        isCustom: true,
        createdBy: session.user.id,
        searchIndex: `${validatedData.name} ${validatedData.brand || ""}`.toLowerCase(),
      },
    });

    return NextResponse.json(food, { status: 201 });
  } catch (error) {
    console.error("Error creating food:", error);
    return NextResponse.json(
      { error: "Failed to create food" },
      { status: 500 }
    );
  }
} 