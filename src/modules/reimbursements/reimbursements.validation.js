export const validateCreateReimbursement = ({
  title,
  description,
  amount,
}) => {
  if (
    !title ||
    !description ||
    !amount
  ) {
    return {
      isValid: false,
      message:
        "title, description and amount are required",
    };
  }

  if (Number(amount) <= 0) {
    return {
      isValid: false,
      message:
        "amount must be greater than 0",
    };
  }

  return {
    isValid: true,
  };
};