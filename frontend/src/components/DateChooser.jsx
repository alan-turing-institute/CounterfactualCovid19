import "../css/overrides/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import exact from "prop-types-exact";
import PropTypes from "prop-types";
import React from "react";
import commonStyles from "../css/Common.module.css";
import localStyles from "../css/DateChooser.module.css";

const propTypes = exact({
  allowedDates: PropTypes.array,
  caption: PropTypes.string.isRequired,
  nominalDate: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
});

const defaultProps = {};

const styles = { ...commonStyles, ...localStyles };

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
    const nonNullAllowedDates = this.props.allowedDates
      ? this.props.allowedDates.filter(Boolean)
      : [];
    const includeDates =
      nonNullAllowedDates.length > 0
        ? nonNullAllowedDates.map((element) => new Date(element))
        : null;
    const highlightDates = this.props.nominalDate
      ? [new Date(this.props.nominalDate)]
      : [];
    const extraProps = includeDates ? {} : { disabled: true };

    return (
      <div className={styles.contents_centered}>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          highlightDates={highlightDates}
          includeDates={includeDates}
          onChange={this.handleDateChange}
          selected={this.state.date}
          isClearable
          {...extraProps}
        />
        <p className={styles.centered_text}>
          <em>{this.props.caption}</em>
        </p>
      </div>
    );
  }
}

DateChooser.propTypes = propTypes;
DateChooser.defaultProps = defaultProps;

export default DateChooser;
