export const validateAssignEmployee = ({
  employeeId,
  managerId,
} = {}) => {
  if (!employeeId || !managerId) {
    return {
      isValid: false,
      message:
        "employeeId and managerId are required",
    };
  }

  if (employeeId === managerId) {
    return {
      isValid: false,
      message:
        "Employee cannot report to themselves",
    };
  }

  return {
    isValid: true,
  };
};

export const validateUnassignEmployee = ({
  employeeId,
  managerId,
} = {}) => {
  if (!employeeId || !managerId) {
    return {
      isValid: false,
      message:
        "employeeId and managerId are required",
    };
  }

  return {
    isValid: true,
  };
};