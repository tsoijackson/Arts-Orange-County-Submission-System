import React, { Component } from 'react';
import {Input} from 'react-materialize';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import $ from 'jquery'

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      long: 0,
      address:""
    };
  }

 componentWillMount() {
   console.log(this.props.currentVal)
   let address = this.props.currentVal
   if (address === null) {
     address = "San Jose"
   }
   // first time geocodeByAddress is called it does not work
   geocodeByAddress(address)
   .then(results => getLatLng(results[0]))
   .then(latLng => this.setState({
     lat: latLng["lat"],
     long: latLng["lng"]
   }))
   .then(this.pushGeoDataHelper())
   .catch(error => console.error('Error', error));
   this.setState({
     address: address
   })
}


  handleChange = address => {
    this.setState({
      address: address
    });
  };

  handleSelect = address => {
    this.setState({
      address: address
    })
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({
        lat: latLng["lat"],
        long: latLng["lng"]
      }))
      .then(this.setState({address:address}))
      .then(this.pushGeoDataHelper())
      .catch(error => console.error('Error', error));
  };

  pushGeoDataHelper = () => {
    console.log("pushGeoDateHelper called")
    console.log(this.state.long)
    console.log(this.state.lat)
    console.log(this.state.address)
    this.props.pushGeoData(this.state.long, this.state.lat, this.state.address)
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Input s={12} id="map_input" label="School"
              {...getInputProps({className: 'location-search-input'})}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? {
                    backgroundColor: '#fafafa',
                    cursor: 'pointer'
                  }
                  : {
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>
                      {suggestion.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
export default LocationSearchInput;
