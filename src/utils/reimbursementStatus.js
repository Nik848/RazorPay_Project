export const getFinalStatus = (
  statusRecord
) => {
  if (
    statusRecord.rmStatus === "REJECTED" ||
    statusRecord.apeStatus === "REJECTED" ||
    statusRecord.cfoStatus === "REJECTED"
  ) {
    return "REJECTED";
  }

  if (
    statusRecord.rmStatus === "APPROVED" &&
    statusRecord.apeStatus === "APPROVED"
  ) {
    return "APPROVED";
  }

  return "PENDING";
};