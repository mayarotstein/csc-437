// src/routes/guests.ts
import express, { Request, Response } from "express";
import { Guest } from "../models/guest";

import Guests from "../services/guest-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
    Guests.index()
      .then((list: Guest[]) => res.json(list))
      .catch((err) => res.status(500).send(err));
  });
  
router.get("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
  
    Guests.get(userid)
      .then((guest: Guest) => res.json(guest))
      .catch((err) => res.status(404).send(err));
  });

  router.post("/", (req: Request, res: Response) => {
    const newGuest = req.body;
  
    Guests.create(newGuest)
      .then((guest: Guest) =>
        res.status(201).json(guest)
      )
      .catch((err) => res.status(500).send(err));
  });

  router.put("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
    const newGuest = req.body;

    Guests
      .update(userid, newGuest)
      .then((guest: Guest) => res.json(guest))
      .catch((err) => res.status(404).send(err));
  });

  router.delete("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
  
    Guests.remove(userid)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).send(err));
  });


  export default router;
