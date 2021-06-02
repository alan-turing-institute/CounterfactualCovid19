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

class DateChooser extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      date: null,
    };

    // Bind functions that need to be used by other functions
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  stringFromDate(inputDate) {
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

  async handleDateChange(newDate) {
    console.log(`${this.props.caption} updated to ${newDate}`);
    this.setState({ date: newDate });
    await this.props.onDateChange(this.stringFromDate(newDate));
  }

  render() {
    const includeDates = this.props.allowedDates
      ? this.props.allowedDates.map((element) => new Date(element))
      : null;
    const highlightDates = this.props.nominalDate
      ? [new Date(this.props.nominalDate)]
      : null;

    return includeDates ? (
      <div className="date-chooser">
        <DatePicker
          dateFormat="yyyy-MM-dd"
          highlightDates={highlightDates}
          includeDates={includeDates}
          onChange={this.handleDateChange}
          selected={this.state.date}
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
