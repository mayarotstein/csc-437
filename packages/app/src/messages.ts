import { Guest } from "server/models";

export type Msg =
  | [
      "profile/save",
      {
        userid: string;
        profile: Guest;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["profile/select", { userid: string }];