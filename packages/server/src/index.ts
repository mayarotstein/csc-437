// src/index.ts
import express, { Request, Response } from "express";
import { RestaurantPage } from "./pages/restaurant";
import { getRestaurant, getHeaderData } from "./services/restaurant-svc";
import { connect } from "./services/mongo";
import Guests from "./services/guest-svc";
import guests from "./routes/guests";


connect("slofoodguide");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
console.log(staticDir)
app.use(express.static(staticDir));

// Middleware:
app.use(express.json());

app.use("/api/guests", guests);


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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});