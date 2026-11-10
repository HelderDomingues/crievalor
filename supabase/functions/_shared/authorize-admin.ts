export type AuthorizationResult =
  | { authorized: true; userId: string }
  | { authorized: false; status: 401 | 403 | 503 };

export async function authorizeAdminRequest(
  authorizationHeader: string | null,
  verifyUser: (token: string) => Promise<string | null>,
  hasAdminRole: (userId: string) => Promise<boolean>,
): Promise<AuthorizationResult> {
  const token = authorizationHeader?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return { authorized: false, status: 401 };

  try {
    const userId = await verifyUser(token);
    if (!userId) return { authorized: false, status: 401 };
    if (!(await hasAdminRole(userId))) {
      return { authorized: false, status: 403 };
    }

    return { authorized: true, userId };
  } catch {
    return { authorized: false, status: 503 };
  }
}
