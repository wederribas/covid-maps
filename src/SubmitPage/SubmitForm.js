import React from "react";
import Map from "../Map";
import LocationSearchControl from "./LocationSearch";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import * as api from "../api";
import { geocodeByLatlng, getAddressComponent } from "../utils";

function ButtonWithLoading(props) {
  return props.isLoading ? (
    <Button variant="primary" disabled>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />{" "}
      Submitting...
    </Button>
  ) : (
    <Button {...props} />
  );
}

class SubmitForm extends React.Component {
  state = {
    isLoading: false,
    hasSubmitted: false,
    data: {
      "Store Name": "",
      "Store Category": "Grocery", // default selection
      "Useful Information": "",
      "Safety Observations": "",
      Latitude: "",
      Longitude: "",
      City: "",
      Locality: "",
      "Place Id": "",
      Address: ""
    }
  };

  onLocationSearchCompleted = ({
    latLng,
    name,
    address,
    city,
    locality,
    place_id,
    types
  }) => {
    this.setState({
      position: latLng,
      data: {
        ...this.state.data,
        "Store Name": name,
        Latitude: latLng.lat,
        Longitude: latLng.lng,
        City: city,
        Locality: locality,
        "Place Id": place_id,
        Address: address
      }
    });
  };

  onSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const elements = event.target.elements;
    const data = {
      ...this.state.data,
      Safety: elements.formBasicCrowdDetails.value,
      Timestamp: new Date().toISOString()
    };
    api.submit(data).then(response => {
      console.log(response);
      this.setState({ isLoading: false, hasSubmitted: true });
    });
  }

  onChangeInput({ target }, dataKey) {
    this.setState({ data: { ...this.state.data, [dataKey]: target.value } });
  }

  componentDidMount() {
    if (this.props.location.state) {
      // Initial props from "Share your experience"
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.location.state.item
        }
      });
    }
  }

  render() {
    return (
      <>
        <div className="container">
          <Form.Group controlId="formBasicLocation">
            <LocationSearchControl
              text={"text"}
              onSuccess={this.onLocationSearchCompleted}
              defaultValue={
                this.props.location.state
                  ? this.props.location.state.item["Store Name"]
                  : ""
              }
            />
          </Form.Group>
        </div>

        <Map
          style={{ height: 300 }}
          onMarkerDragged={async latLng => {
            const results = await geocodeByLatlng(latLng);
            if (results.length) {
              const result = results[0];
              this.onLocationSearchCompleted({
                latLng,
                name: result.formatted_address,
                address: result.formatted_address,
                city: getAddressComponent(
                  result.address_components,
                  "locality"
                ),
                locality: getAddressComponent(
                  result.address_components,
                  "neighborhood"
                ),
                place_id: result.place_id,
                types: result.types
              });
            }
          }}
          position={
            this.state.data.Latitude
              ? {
                  lat: parseFloat(this.state.data.Latitude),
                  lng: parseFloat(this.state.data.Longitude)
                }
              : undefined
          }
        />

        <Form onSubmit={e => this.onSubmit(e)}>
          <div className="container">
            <Form.Group controlId="formBasicStore">
              <Form.Label>Store Name</Form.Label>
              <Form.Control
                type="text"
                onChange={e => this.onChangeInput(e, "Store Name")}
                value={this.state.data["Store Name"]}
                placeholder="Enter store name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicServiceType">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.onChangeInput(e, "Store Category")}
              >
                <option>Grocery</option>
                <option>Restaurant</option>
                <option>ATM</option>
                <option>Clinic</option>
                <option>Pharmacy</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicCrowdDetails">
              <Form.Label>Safety Observations</Form.Label>
              <Form.Control
                as="textarea"
                rows="2"
                onChange={e => this.onChangeInput(e, "Safety Observations")}
                value={this.state.data["Safety Observations"]}
                placeholder="Queues, crowd level &amp; safety precautions"
              />
            </Form.Group>

            <Form.Group controlId="formBasicComments">
              <Form.Label>Useful Information</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                onChange={e => this.onChangeInput(e, "Useful Information")}
                value={this.state.data["Useful Information"]}
                placeholder="Contact number, timing, stock availability, etc."
              />
            </Form.Group>

            {this.state.hasSubmitted ? (
              <Alert variant="success">Submitted!</Alert>
            ) : null}

            <ButtonWithLoading
              isLoading={this.state.isLoading}
              variant="primary"
              type="submit"
            >
              Update
            </ButtonWithLoading>
          </div>
        </Form>
      </>
    );
  }
}

export default SubmitForm;
