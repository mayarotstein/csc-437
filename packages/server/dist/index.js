"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_restaurant = require("./pages/restaurant");
var import_restaurant_svc = require("./services/restaurant-svc");
var import_mongo = require("./services/mongo");
var import_guest_svc = __toESM(require("./services/guest-svc"));
var import_guests = __toESM(require("./routes/guests"));
var import_auth = __toESM(require("./routes/auth"));
var import_auth2 = require("./pages/auth");
var import_filesystem = require("./services/filesystem");
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
(0, import_mongo.connect)("slofoodguide");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
console.log(staticDir);
app.use(import_express.default.static(staticDir));
app.use(import_express.default.raw({ type: "image/*", limit: "32Mb" }));
app.use(import_express.default.json());
app.use("/auth", import_auth.default);
app.use("/api/guests", import_auth.authenticateUser, import_guests.default);
app.post("/images", import_filesystem.saveFile);
app.get("/images/:id", import_filesystem.getFile);
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get(
  "/restaurant/:guests/:username",
  (req, res) => {
    const { guests: guests2, username } = req.params;
    const restaurant = (0, import_restaurant_svc.getRestaurant)(guests2);
    const header = (0, import_restaurant_svc.getHeaderData)();
    import_guest_svc.default.get(username).then((guest) => {
      const data = { restaurant, header, guest };
      const page = new import_restaurant.RestaurantPage(data);
      res.set("Content-Type", "text/html").send(page.render());
    });
  }
);
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/register", (req, res) => {
  const page = new import_auth2.RegistrationPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.use("/app", (req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, { encoding: "utf8" }).then(
    (html) => res.send(html)
  );
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
