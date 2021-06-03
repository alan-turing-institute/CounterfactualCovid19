import "react-datepicker/dist/react-datepicker.css";
import "../css/DateChooser.css";
import DatePicker from "react-datepicker";
import exact from "prop-types-exact";
import PropTypes from "prop-types";
import React from "react";

const propTypes = exact({
  allowedDates: PropTypes.array,
  caption: PropTypes.string.isRequired,
  nominalDate: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
});

const defaultProps = {};

class DateChooser extends React.PureComponent {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      date: null,
    };

    // Bind functions that need to use `this`
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  stringFromDate(inputDate) {
    try {
      if (!inputDate) {
        return inputDate;
      }
      const year = inputDate.getFullYear();
      const month = `0${inputDate.getMonth() + 1}`.slice(-2);
      const day = `0${inputDate.getDate()}`.slice(-2);
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.log(error);
      return inputDate;
    }
  }

  async handleDateChange(newDate) {
    const newDateString = this.stringFromDate(newDate);
    console.log(`${this.props.caption} updated to ${newDateString}`);
    // 1. Propagate the date change to the callback function
    // 2. Validate the local date change and update the state accordingly
    await Promise.all([
      this.props.onDateChange(newDateString),
      this.setState({
        date:
          this.props.allowedDates &&
          this.props.allowedDates.find((element) => element === newDateString)
            ? newDate
            : null,
      }),
    ]);
  }

  render() {
    const includeDates = this.props.allowedDates
      ? this.props.allowedDates.map((element) => new Date(element))
      : null;
    const highlightDates = this.props.nominalDate
      ? [new Date(this.props.nominalDate)]
      : [];

    return includeDates ? (
      <div className="date-chooser">
        <DatePicker
          dateFormat="yyyy-MM-dd"
          highlightDates={highlightDates}
          includeDates={includeDates}
          onChange={this.handleDateChange}
          selected={this.state.date}
          isClearable
        />
        <em>{this.props.caption}</em>
      </div>
    ) : (
      <div></div>
    );
  }
}
DateChooser.propTypes = propTypes;
DateChooser.defaultProps = defaultProps;

export default DateChooser;
