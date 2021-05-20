export default function convert(inputDate) {
  if (!inputDate) {
    return inputDate;
  }
  var date = inputDate,
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
