// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Guest } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "profile/select":
      selectProfile(message[1], user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
      case "profile/save":
        saveProfile(message[1], user)
          .then((profile) =>
            apply((model) => ({ ...model, profile }))
          )
          .then(() => {
            const { onSuccess } = message[1];
            if (onSuccess) onSuccess();
          })
          .catch((error: Error) => {
            const { onFailure } = message[1];
            if (onFailure) onFailure(error);
          });
        break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function selectProfile(
    msg: { userid: string },
    user: Auth.User
  ) {
    return fetch(`/api/guests/${msg.userid}`, {
      headers: Auth.headers(user)
    })
      .then((response: Response) => {
        if (response.status === 200) {
          return response.json();
        }
        return undefined;
      })
      .then((json: unknown) => {
        if (json) {
          console.log("Profile:", json);
          return json as Guest;
        }
      });
  }

  function saveProfile(
    msg: {
      userid: string;
      profile: Guest;
    },
    user: Auth.User
  ) {
    console.log("saveProfile", msg.profile)
    return fetch(`/api/guests/${msg.userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...Auth.headers(user)
      },
      body: JSON.stringify(msg.profile)
    })
      .then((response: Response) => {
        console.log("Response status:", response.status);
        if (response.status === 200) return response.json();
        else
          throw new Error(
            `Failed to save profile for ${msg.userid}`
          );
      })
      .then((json: unknown) => {
        if (json) return json as Guest;
        return undefined;
      });
  }