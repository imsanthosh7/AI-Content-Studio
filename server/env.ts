import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file with explicit path
const envPath = join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

export {}; 