import type { Session } from "@notebook/auth/server";

export type UserProfileDropdownProps = {
  data: Session;
  initials: string | undefined;
};
