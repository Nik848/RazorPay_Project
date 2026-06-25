const VALID_ROLES = ["EMP", "RM", "APE", "CFO"];

export const validateAssignRole = ({
  userId,
  role,
}) => {
  if (!userId || !role) {
    return {
      isValid: false,
      message: "userId and role are required",
    };
  }

  if (!VALID_ROLES.includes(role)) {
    return {
      isValid: false,
      message: "Invalid role",
    };
  }

  return {
    isValid: true,
  };
};