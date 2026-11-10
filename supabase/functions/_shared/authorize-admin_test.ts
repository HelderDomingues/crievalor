import { authorizeAdminRequest } from "./authorize-admin.ts";

Deno.test("rejects requests without a bearer token", async () => {
  let verificationCalled = false;
  const result = await authorizeAdminRequest(
    null,
    () => {
      verificationCalled = true;
      return Promise.resolve("user-id");
    },
    () => Promise.resolve(true),
  );

  if (result.authorized || result.status !== 401 || verificationCalled) {
    throw new Error(
      "missing bearer token was not rejected before verification",
    );
  }
});

Deno.test("rejects an invalid user token", async () => {
  let roleLookupCalled = false;
  const result = await authorizeAdminRequest(
    "Bearer invalid-token",
    () => Promise.resolve(null),
    () => {
      roleLookupCalled = true;
      return Promise.resolve(true);
    },
  );

  if (result.authorized || result.status !== 401 || roleLookupCalled) {
    throw new Error("invalid user token was not rejected before role lookup");
  }
});

Deno.test("rejects a valid user without admin or owner role", async () => {
  const result = await authorizeAdminRequest(
    "Bearer valid-token",
    () => Promise.resolve("regular-user-id"),
    () => Promise.resolve(false),
  );

  if (result.authorized || result.status !== 403) {
    throw new Error("regular user was not denied privileged access");
  }
});

Deno.test("fails closed when role lookup fails", async () => {
  const result = await authorizeAdminRequest(
    "Bearer valid-token",
    () => Promise.resolve("user-id"),
    () => Promise.reject(new Error("role lookup failed")),
  );

  if (result.authorized || result.status !== 503) {
    throw new Error("role lookup failure did not fail closed");
  }
});

Deno.test("allows a verified admin or owner", async () => {
  const result = await authorizeAdminRequest(
    "Bearer valid-token",
    () => Promise.resolve("owner-user-id"),
    (userId) => Promise.resolve(userId === "owner-user-id"),
  );

  if (!result.authorized || result.userId !== "owner-user-id") {
    throw new Error("verified admin or owner was not authorized");
  }
});
