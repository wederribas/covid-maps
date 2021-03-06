import React from "react";
import { Link } from "react-router-dom";
import { recordAddInfoToStoreCard } from "../gaEvents";

export default class MissingBlock extends React.Component {
  render() {
    const { result } = this.props;
    const entry = result.entries.length ? result.entries[0] : undefined;
    return (
      <div
        className={`card my-2 ${
          this.props.missing ? "text-white bg-info" : null
        }`}
      >
        <div className="card-body p-3">
          <Link
            to={{ pathname: "/update", state: { item: entry } }}
            className="float-right btn btn-sm btn-outline-light text-uppercase"
            onClick={recordAddInfoToStoreCard}
          >
            Add
          </Link>
          <h5 className="card-title m-0 p-0">{result.name}</h5>
          <p className="card-text">
            We don't have information on this location yet. Help out by adding
            some!
          </p>
        </div>
      </div>
    );
  }
}
