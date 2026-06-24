export const validateRegister = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return {
      isValid: false,
      message: "All fields are required",
    };
  }

  if (!email.endsWith("@org.com")) {
    return {
      isValid: false,
      message: "Only org.com email addresses are allowed",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  return {
    isValid: true,
  };
};

export const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    return {
      isValid: false,
      message: "Email and password are required",
    };
  }

  if (!email.endsWith("@org.com")) {
    return {
      isValid: false,
      message: "Only org.com email addresses are allowed",
    };
  }

  return {
    isValid: true,
  };
};