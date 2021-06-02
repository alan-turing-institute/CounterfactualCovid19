import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import exact from "prop-types-exact";
import PropTypes from "prop-types";

const propTypes = exact({
  initialDate: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
  allowedDates: PropTypes.array,
  caption: PropTypes.string.isRequired,
});

const defaultProps = {};

const DateChooser = (props) => {
  function stringFromDate(inputDate) {
    try {
      const year = inputDate.getFullYear();
      const month = `0${inputDate.getMonth() + 1}`.slice(-2);
      const day = `0${inputDate.getDate()}`.slice(-2);
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.log(error);
      return inputDate;
    }
  }

  async function handleDateChange(newDate) {
    console.log(`Changing ${props.caption}: ${newDate}`);
    await props.onDateChange(stringFromDate(newDate));
  }

  const allowedDates = props.allowedDates
    ? props.allowedDates.map((element) => new Date(element))
    : null;

  return allowedDates ? (
    <div>
      <DatePicker
        selected={props.initialDate ? new Date(props.initialDate) : null}
        dateFormat="yyyy-MM-dd"
        onChange={handleDateChange}
        includeDates={allowedDates}
      />
      <em>{props.caption}</em>
    </div>
  ) : (
    <div></div>
  );
};
DateChooser.propTypes = propTypes;
DateChooser.defaultProps = defaultProps;

export default DateChooser;
