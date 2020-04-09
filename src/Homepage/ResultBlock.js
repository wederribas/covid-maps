import React, { useState, useEffect } from "react";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";
import { recordUpdateStore } from "../gaEvents";
import Highlighter from "react-highlight-words";

function constructDirectionsUrl({ name, placeId, lat, lng }) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
}

function shareListing(e, listing) {
  e.stopPropagation();
  let storeName = listing.name
  let placeId = listing.placeId
  let url = `${window.location.origin}/listing/${placeId}`
  if (navigator.share) {
    navigator.share({
      title: `${storeName}`,
      text: `Check out the latest information on ${storeName} using Covid Maps — crowdsourced updates on essential services during lockdown period. \n`,
      url: url
    })
  }
}

function prepareStoreForUpdate(entry) {
  return {
    ...entry,
    "Safety Observations": "",
    "Useful Information": "",
    "Store Category": entry['Store Category'] && entry['Store Category'].length ?
      entry['Store Category'][0] : ""
  };
}

const ResultBlock = (props) => {
  const [showShareButton, setShareButtonState] = useState(false)
  useEffect(() => {
    if (navigator.share) {
      setShareButtonState(true)
    }
  })
  function onClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    props.onClick && props.onClick(props.result);
  }

  const { result } = props;
  const entry = result.entries.length ? result.entries[0] : undefined;
  return (
    <div
      onClick={() => onClick()}
      className={`card my-1 card-result-block ${props.isSelected ? "card-result-block-selected" : ""}`}
    >
      <div className="card-body p-3">
        <a
          href={constructDirectionsUrl(result)}
          target="_blank"
          rel="noopener noreferrer"
          className="float-right btn btn-sm btn-outline-secondary text-uppercase ml-2"
        >
          <i className="far fa-directions"></i>
        </a>
        <Link
          to={{ pathname: "/update", state: { item: prepareStoreForUpdate(entry) } }}
          className="float-right btn btn-sm btn-outline-success text-uppercase"
          onClick={recordUpdateStore}
        >
          Update
          </Link>
        {
          showShareButton &&
          <div
            onClick={(e) => shareListing(e, result)}
            className="float-right btn btn-sm btn-outline-secondary text-uppercase mr-2"
          >
            <i className="far fa-share-alt"></i>
          </div>
        }

        <h5 className="card-title m-0 p-0">
          <Highlighter
            highlightClassName="highlighted-text"
            searchWords={[props.highlightedText]}
            autoEscape={true}
            textToHighlight={result.name}
          />
        </h5>
        <ResultEntry highlightedText={props.highlightedText} entries={result.entries} />
      </div>
    </div>
  );
}

export default ResultBlock;