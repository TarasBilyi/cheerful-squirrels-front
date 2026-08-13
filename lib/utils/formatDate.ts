/**
 * Backend stores `date` as an ISO "YYYY-MM-DD" string.
 * Figma shows it as "DD.MM.YYYY", so we format on the frontend.
 */
export const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');

  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}.${month}.${year}`;
};
