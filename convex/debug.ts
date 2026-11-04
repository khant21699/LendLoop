import { query } from "./_generated/server";

// Temporary: returns the signed-in user's identity, or null if not authenticated.
export const whoami = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});
