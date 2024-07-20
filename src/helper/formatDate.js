export default function formatDate(dateString) {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);

  // Ensure that the date is interpreted correctly
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(localDate);

  // Extract day to add ordinal
  const day = localDate.getDate();
  const dayWithOrdinal =
    day +
    (day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th");

  return formattedDate.replace(day, dayWithOrdinal);
}
