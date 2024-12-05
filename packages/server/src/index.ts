// src/index.ts
import express, { Request, Response } from "express";
import { RestaurantPage } from "./pages/restaurant";
import { getRestaurant, getHeaderData } from "./services/restaurant-svc";
import { connect } from "./services/mongo";
import Guests from "./services/guest-svc";
import guests from "./routes/guests";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";
import { getFile, saveFile } from "./services/filesystem";
import fs from "node:fs/promises";
import path from "path";




connect("slofoodguide");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
console.log(staticDir)
app.use(express.static(staticDir));

// Middleware:
app.use(express.raw({ type: "image/*", limit: "32Mb" }));
app.use(express.json());

//Auth Routes
app.use("/auth", auth);

//API Routes
app.use("/api/guests", authenticateUser, guests);


// Images routes
app.post("/images", saveFile);
app.get("/images/:id", getFile);


//Page Routes 
app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});


app.get(
  "/restaurant/:guests/:username",
  (req: Request, res: Response) => {
    const { guests, username } = req.params;
    const restaurant = getRestaurant(guests);
    const header = getHeaderData();
    
    Guests.get(username).then((guest) => {
      const data = { restaurant, header, guest };
      const page = new RestaurantPage(data);

    res.set("Content-Type", "text/html").send(page.render());
    });
    
  }
);

//getting the guest data as a json not text/html
app.get("/api/guests/:username", authenticateUser, (req: Request, res: Response) => {
  const { username } = req.params;

  Guests.get(username).then((guest) => {
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json(guest); // Respond with JSON data
  }).catch((err) => {
    console.error("Error fetching guest:", err);
    res.status(500).json({ error: "Failed to fetch guest" });
  });
});


app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

// SPA Routes: /app/...
app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

//Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});