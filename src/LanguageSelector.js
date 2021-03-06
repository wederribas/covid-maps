import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import { withGlobalContext } from "./App";
import { AVAILABLE_LANGUAGES } from "./constants";
import { recordLanguageSelection } from "./gaEvents";

class LanguageSelector extends Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    setLanguage: PropTypes.func.isRequired,
  };

  handleLanguageSelect = language => {
    recordLanguageSelection(language);
    this.props.setLanguage(language);
  };

  render() {
    return (
      <Dropdown className="language-selector" drop="up">
        <Dropdown.Toggle className="language-selector__toggle">
          <i className="far fa-globe"></i> {this.props.currentLanguage}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(AVAILABLE_LANGUAGES).map(key => {
            const langValue = AVAILABLE_LANGUAGES[key];
            return (
              <Dropdown.Item
                key={langValue}
                active={this.props.currentLanguage === langValue}
                onClick={() => this.handleLanguageSelect(langValue)}
                className="language-selector__item"
              >
                {langValue}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default withGlobalContext(LanguageSelector);
