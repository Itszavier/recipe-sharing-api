/** @format */
export const available_permissions = [
  "create:recipe",
  "create:apiKey",
  "read:recipe",
  "update:recipe",
  "delete:recipe",
] as const;

export enum AvailablePermissions {
  CreateRecipe = "create:recipe",
  CreateApiKey = "create:apiKey",
}
export default function checkPermissions(
  userPerms: string[],
  requiredPerms: string[]
) {
  return requiredPerms.every((perm) => userPerms.includes(perm));
}
