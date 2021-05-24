import exact from "prop-types-exact";
import PropTypes from "prop-types";
import DatePicker from "react-date-picker";

const propTypes = exact({
  onDateChange: PropTypes.func.isRequired,
  dateString: PropTypes.string,
});

const defaultProps = {};

const DateChooser = (props) => {
  function stringFromDate(inputDate) {
    try {
      return inputDate.toISOString().split("T")[0];
    } catch (error) {
      console.log(error);
      return inputDate;
    }
  }

  async function handleDateChange(newDate) {
    console.log(`Setting new date: ${newDate}`);
    await props.onDateChange(stringFromDate(newDate));
  }

  return props.dateString ? (
    <DatePicker
      onChange={handleDateChange}
      value={new Date(props.dateString)}
      format="yyyy-MM-dd"
      className="form-control"
      monthsShown={1}
      popperPlacement="bottom"
    />
  ) : (
    <div></div>
  );
};
DateChooser.propTypes = propTypes;
DateChooser.defaultProps = defaultProps;

export default DateChooser;
