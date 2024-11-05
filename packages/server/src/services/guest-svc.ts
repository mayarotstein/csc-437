//src/services/guest-svc.ts
import { Schema, model } from "mongoose";
import { Guest } from "../models/guest";

const GuestSchema = new Schema<Guest>(
  {
    username: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    favoritemeal: {type: String, trim: true},
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

function create(json: Guest): Promise<Guest> {
  const t = new GuestModel(json);
  return t.save();
}
  
function update(
  username: String,
  guest: Guest
): Promise<Guest> {
  return GuestModel.findOneAndUpdate({ username }, guest, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${username} not updated`;
    else return updated as Guest;
  });
}

function remove(userid: String): Promise<void> {
  return GuestModel.findOneAndDelete({ userid }).then(
    (deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    }
  );
}



export default { index, get, create, update, remove };
