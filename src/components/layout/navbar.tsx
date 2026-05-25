import { isAuthConfigured } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/user";
import { NavbarClient, type NavbarAuth } from "./navbar-client";

/**
 * Server wrapper around the (client) NavbarClient. Fetches the current
 * auth state once per render and hands it down so the menu can show
 * Sign in / Dashboard correctly without an extra browser round-trip.
 */
export async function Navbar() {
  let auth: NavbarAuth = { kind: "unconfigured" };

  if (isAuthConfigured()) {
    const user = await getCurrentUser();
    auth = user
      ? { kind: "user", email: user.email ?? "" }
      : { kind: "guest" };
  }

  return <NavbarClient auth={auth} />;
}
