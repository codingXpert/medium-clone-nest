import { UserType } from "@app/types/user.types";

export type ProfileType = UserType & { following: boolean };      // exporting the whole user type with additional property of following