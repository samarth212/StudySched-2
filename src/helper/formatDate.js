export default function formatDate(dateString) {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);

  const options = { weekday: "long" };
  const dayOfWeek = new Intl.DateTimeFormat("en-US", options).format(date);

  const monthOptions = { month: "long" };
  const month = new Intl.DateTimeFormat("en-US", monthOptions).format(date);

  const day = date.getDate();
  const dayWithOrdinal =
    day +
    (day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th");

  const year = date.getFullYear();

  return `${dayOfWeek}, ${month} ${dayWithOrdinal}, ${year}`;
}
