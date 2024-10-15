
import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { getUser } from "./users";
import { fileTypes } from "./schema";

export const generateUpoloadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity) {
        throw new ConvexError('You must be logged in to upload a file');
    }
    return await ctx.storage.generateUploadUrl();
})

export async function hasAccessToOrg(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string,
    orgId: string
  ) {
    const user = await getUser(ctx, tokenIdentifier);

        const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

        return hasAccess;

  }

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: fileTypes,
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new ConvexError('You must be logged in to upload a file');
        }

        const hasAccess = hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);
    
       if (!hasAccess){
        throw new ConvexError("you do not have acces to this org");
       }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId,
            type: args.type,
        })
    }
});

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {

        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            return [];
        }

        const hasAccess = hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);
    
        if (!hasAccess){
            return [];
       }

        return ctx.db.query('files').withIndex('by_orgId', q => 
            q.eq('orgId', args.orgId)
        ).collect();
    }
});

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("you do not have access to this org");
      }
      const file = await ctx.db.get(args.fileId);
      if (!file) {
        throw new ConvexError("this file does not exist");
      }
      const hasAccess = await hasAccessToOrg(
        ctx,
        identity.tokenIdentifier,
        file.orgId
      );
      if (!hasAccess) {
        throw new ConvexError("you do not have access to delete this file");
      }
      await ctx.db.delete(args.fileId);
    },
  });

  export const getFileUrl = query({
    args: {
      fileId: v.id("_storage"), // Argument for the file ID (from storage)
    },
    handler: async (ctx, { fileId }) => {
      // Validate if fileId exists and is valid
      if (!fileId) {
        throw new Error("fileId is required.");
      }
  
      // Get the URL for the file in storage by fileId
      const fileUrl = await ctx.storage.getUrl(fileId);
  
      // If no file was found, return null or an error
      if (!fileUrl) {
        throw new Error(`No file found for the provided fileId: ${fileId}`);
      }
  
      // Return the file URL
      return fileUrl;
    },
  });
