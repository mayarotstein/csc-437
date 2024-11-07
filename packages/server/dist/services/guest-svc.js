"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var guest_svc_exports = {};
__export(guest_svc_exports, {
  default: () => guest_svc_default
});
module.exports = __toCommonJS(guest_svc_exports);
var import_mongoose = require("mongoose");
const GuestSchema = new import_mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    favoritemeal: { type: String, trim: true },
    partysize: { type: Number, trim: true }
  },
  { collection: "slofood_guests" }
);
const GuestModel = (0, import_mongoose.model)("Profile", GuestSchema);
function index() {
  return GuestModel.find();
}
function get(username) {
  return GuestModel.find({ username }).then((list) => list[0]).catch((err) => {
    throw `${username} Not Found`;
  });
}
function create(json) {
  const t = new GuestModel(json);
  return t.save();
}
function update(username, guest) {
  return GuestModel.findOneAndUpdate({ username }, guest, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${username} not updated`;
    else return updated;
  });
}
function remove(userid) {
  return GuestModel.findOneAndDelete({ userid }).then(
    (deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    }
  );
}
var guest_svc_default = { index, get, create, update, remove };
