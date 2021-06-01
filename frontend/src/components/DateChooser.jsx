import DatePicker from "react-date-picker";
import exact from "prop-types-exact";
import PropTypes from "prop-types";

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
      className="form-control"
      clearIcon={null}
      format="yyyy-MM-dd"
      monthsShown={1}
      onChange={handleDateChange}
      popperPlacement="bottom"
      value={new Date(props.dateString)}
    />
  ) : (
    <div></div>
  );
};
DateChooser.propTypes = propTypes;
DateChooser.defaultProps = defaultProps;

export default DateChooser;
