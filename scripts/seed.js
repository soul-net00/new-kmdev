require("dotenv").config();
const { seedDatabase } = require("./src/lib/default-data");

async function main() {
  try {
    console.log("🚀 Running database seed script...\n");
    await seedDatabase();
    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();