import { logoutAction } from "./actions";

export default async function LogoutPage() {
  await logoutAction();
  return null;
}

