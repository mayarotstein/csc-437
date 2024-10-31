//src/services/guest-svc.ts
import { Schema, model } from "mongoose";
import { Guest } from "../models/guest";

const GuestSchema = new Schema<Guest>(
  {
    username: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    partysize: { type: Number, trim: true },
  },
  { collection: "slofood_guests" }
);

const GuestModel = model<Guest>("Profile", GuestSchema);

function index(): Promise<Guest[]> {
    return GuestModel.find();
  }
  
  function get(username: String): Promise<Guest> {
    return GuestModel.find({ username })
      .then((list) => list[0])
      .catch((err) => {
        throw `${username} Not Found`;
      });
  }
  
  export default { index, get };
