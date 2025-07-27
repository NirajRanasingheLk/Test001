import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a sample user first
  const user = await prisma.user.create({
    data: {
      name: 'Sample User',
      email: 'sample@example.com',
      age: 30,
      gender: 'other',
      height: 170,
      weight: 70,
      activityLevel: 'moderately_active',
    },
  });

  console.log('Created user:', user.name);

  // Create sample food items
  const foods = await Promise.all([
    prisma.foodItem.create({
      data: {
        name: 'Chicken Breast',
        brand: 'Organic Valley',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0,
        sodium: 74,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Brown Rice',
        brand: 'Uncle Ben\'s',
        calories: 111,
        protein: 2.6,
        carbs: 23,
        fat: 0.9,
        fiber: 1.8,
        sugar: 0.4,
        sodium: 5,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Broccoli',
        brand: 'Fresh Market',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
        fiber: 2.6,
        sugar: 1.5,
        sodium: 33,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Salmon',
        brand: 'Wild Alaskan',
        calories: 208,
        protein: 25,
        carbs: 0,
        fat: 12,
        fiber: 0,
        sugar: 0,
        sodium: 59,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Sweet Potato',
        brand: 'Organic',
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fat: 0.1,
        fiber: 3,
        sugar: 4.2,
        sodium: 55,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Greek Yogurt',
        brand: 'Chobani',
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        fiber: 0,
        sugar: 3.2,
        sodium: 36,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Oatmeal',
        brand: 'Quaker',
        calories: 68,
        protein: 2.4,
        carbs: 12,
        fat: 1.4,
        fiber: 1.7,
        sugar: 0.3,
        sodium: 49,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
    prisma.foodItem.create({
      data: {
        name: 'Banana',
        brand: 'Fresh',
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fat: 0.3,
        fiber: 2.6,
        sugar: 12,
        sodium: 1,
        servingSize: 100,
        servingUnit: 'grams',
        isCustom: false,
      },
    }),
  ]);

  console.log('Created food items:', foods.length);

  // Create a sample recipe
  const recipe = await prisma.recipe.create({
    data: {
      name: 'Grilled Chicken with Brown Rice and Broccoli',
      description: 'A healthy and balanced meal perfect for lunch or dinner',
      instructions: '1. Season chicken breast with salt and pepper\n2. Grill chicken for 6-8 minutes per side\n3. Cook brown rice according to package instructions\n4. Steam broccoli for 5-7 minutes\n5. Serve together with your favorite seasonings',
      prepTime: 10,
      cookTime: 25,
      servings: 2,
      difficulty: 'easy',
      category: 'dinner',
      isPublic: true,
      createdBy: user.id,
      ingredients: {
        create: [
          {
            quantity: 200,
            unit: 'grams',
            foodId: foods[0].id, // Chicken Breast
          },
          {
            quantity: 150,
            unit: 'grams',
            foodId: foods[1].id, // Brown Rice
          },
          {
            quantity: 200,
            unit: 'grams',
            foodId: foods[2].id, // Broccoli
          },
        ],
      },
    },
  });

  console.log('Created recipe:', recipe.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 