// src/index.ts
import express, { Request, Response } from "express";
import { RestaurantPage } from "./pages/restaurant";
import { getRestaurant, getHeaderData } from "./services/restaurant-svc";
import { connect } from "./services/mongo";

connect("slofoodguide");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});


app.get(
  "/restaurant/:destId",
  (req: Request, res: Response) => {
    const { destId } = req.params;
    const restaurant = getRestaurant(destId);
    const header = getHeaderData();
    
    const data = { restaurant, header };
    const page = new RestaurantPage(data);

    res.set("Content-Type", "text/html").send(page.render());
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});