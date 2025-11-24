import express, { Application, Request, Response } from "express";
import route from "./Routes/routes";
import cron from "node-cron";
import connectToDatabase from "./Database/mongoDb";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { CompanyModel } from "./models/CompanyModel/CompanyModel";
import { JwtPayload } from "./types/commonModel";
import { CompanyResponse } from "./types/CompanyModel";
import { AdminResponse } from "./types/AdminTypeModel";
import { AdminModel } from "./models/AdminModel/Admin";
import { refreshBusinessDataDaily, refreshBusinessDataWeekly } from "./middleware/BusinessFunction/refreshBusinessData";
import { CarDriverResponse } from "./types/carDriverTypeModel";
import { CarDriversModel } from "./models/CarDriverModel/CarDriver";
const cors = require("cors");
// instantize an app from express() function
const app: Application = express();
//Add Cors Policies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ncc-sobm.vercel.app",
      "https://web.nethgo.com"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
express.json({ limit: "50mb" });
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string, // Ensure JWT_SECRET is defined in your environment variables
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
    try {
      const user:CompanyResponse | null = await CompanyModel.findOne({ _id: jwt_payload.identifier });

      let AdminUser:AdminResponse | null = await AdminModel.findOne({ _id: jwt_payload.identifier });
      let DriverUser:CarDriverResponse | null = await CarDriversModel.findOne({ _id: jwt_payload.identifier });

      if (user || AdminUser || DriverUser) {
        
        
        return done(null, user ? user : AdminUser ? AdminUser : DriverUser );
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//MongoDb setup
connectToDatabase();

// Only run cron jobs if not on Vercel (Vercel uses its own cron system)
if (process.env.VERCEL !== "1") {
  cron.schedule("0 0 * * *", () => {
    console.log("Running daily business data refresh...");
    refreshBusinessDataDaily();
  });
  cron.schedule("0 0 * * 0", () => {
    console.log("Running weekly business data refresh...");
    refreshBusinessDataWeekly();
  });
}

// Cron job endpoints for Vercel
app.get("/api/cron/daily", async (req: Request, res: Response) => {
  try {
    await refreshBusinessDataDaily();
    res.status(200).json({ message: "Daily business data refresh completed" });
  } catch (error) {
    console.error("Error in daily cron job:", error);
    res.status(500).json({ error: "Failed to run daily cron job" });
  }
});

app.get("/api/cron/weekly", async (req: Request, res: Response) => {
  try {
    await refreshBusinessDataWeekly();
    res.status(200).json({ message: "Weekly business data refresh completed" });
  } catch (error) {
    console.error("Error in weekly cron job:", error);
    res.status(500).json({ error: "Failed to run weekly cron job" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

//All Rout use
app.use(route);

// Only start server if not on Vercel
if (process.env.VERCEL !== "1") {
  const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  app.listen(PORT, () => {
    console.log("server has started on port");
    console.log("http://localhost:" + PORT);
  });
}

// Export app for Vercel
export default app;
