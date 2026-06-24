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


export const validateUpdateReimbursement = ({
  reimbursementId,
  status,
}) => {
  if (!reimbursementId || !status) {
    return {
      isValid: false,
      message:
        "reimbursementId and status are required",
    };
  }

  if (
    !["APPROVED", "REJECTED"].includes(
      status
    )
  ) {
    return {
      isValid: false,
      message:
        "status must be APPROVED or REJECTED",
    };
  }

  return {
    isValid: true,
  };
};