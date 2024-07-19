export const IsRole = {
  notAdmin(role: string) {
    return ["tenant", "artisan"].includes(role?.toLowerCase());
  },
};
