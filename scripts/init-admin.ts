import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcryptjs from "bcryptjs";

const ADMIN_EMAIL = "kgomotsothabo2004@gmail.com";
const ADMIN_PASSWORD = "admin123";

async function initAdmin() {
  await connectToDatabase();

  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  
  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

  const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 12);
  
  await Admin.create({
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created:", ADMIN_EMAIL);
}

initAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });