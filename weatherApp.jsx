// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require("jquery");

"use strict";

var weatherArray = [];

var weatherData = [
    {id: 'FI', name: 'Helsinki, FI', queryparam: 'Helsinki'},
    {id: 'NY', name: 'New York, NY', queryparam: 'New_york'},
    {id: 'UK', name: 'London, UK', queryparam: 'London'},
    {id: 'IL', name: 'Chicago, IL', queryparam: 'Chicago'},
    {id: 'MA', name: 'Boston, MA', queryparam: 'Boston'},
    {id: 'TX', name: 'Houston, TX', queryparam: 'Houston'},
    {id: 'SE', name: 'Stockholm, SE', queryparam: 'Stockholm'},
    {id: 'DK', name: 'Copenhagen, DK', queryparam: 'Copenhagen'},
    {id: 'MU', name: 'Port Louis, MU', queryparam: 'Port_louis'},
    ];

var WeatherContent = React.createClass({
  getInitialState: function() {
    return {weatherData};
},
  handleWeatherDataFetching: function(object) {
    var city = object.selectedCity;
    var country;
    var queryparam;
    for(var i=0; i<weatherData.length; i++){
      if(weatherData[i].queryparam === city){
        country = weatherData[i].id;
      }
    }
  
    //fetch()
    var apikey = 'xxxx';
    $.ajax({
      //replace 'xxxx' with api key
      url: "http://api.wunderground.com/api/'+ apikey + '/conditions/q/" + country +"/" + city + ".json",
      dataType: 'jsonp',
      cache: false,
      type: 'POST',
      success: function(data) {
      var current_observation = data.current_observation;
      this.onSuccessFuntion(current_observation);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
},
  onSuccessFuntion: function(current){
    var location = current.display_location;
    weatherArray.push({
      id: weatherArray.length,
      city: location.full,
      temperature: current.temp_c,
      weatherImg: current.icon_url,
      weatherInfoTitle: current.icon,
  });
  this.setState(weatherArray);
},
  render: function() {
    return (
      <div className="weather_app--content">
        <div className="weather_app--listing">
          <WeatherSelect onWeatherSelect={this.handleWeatherDataFetching} />
          <WeatherList data={this.state.current_weather} />
        </div>
      </div>
    );
  }
});

var WeatherSelect = React.createClass({
  getInitialState: function() {
      return {
        value: 'select',
        options: []
      }
  },  
  change: function(event){
    event.preventDefault();
    this.props.onWeatherSelect({selectedCity: event.target.value});
  },
  render: function() {
    if(this.state.options.length < 1){
          for (var i = 0; i<weatherData.length; i++) {
            var option = weatherData[i];
            this.state.options.push(<option key={i} value={option.queryparam}>{option.name}</option>);
          }
        }
    return (
          <form className="weather_app--form" name="weatherForm">
              <label className="weather_app--select-label" value={this.state.value}/>
              <select className="weather_app--select" name="citySelect" id="citySelect" onChange={this.change}> 
                {this.state.options}
              </select>
          </form>
    );
  }
});

var WeatherList = React.createClass({
  getInitialState: function() {  
    return {weatherArray};
  },
  render: function() {
        var weatherNodes = this.state.weatherArray.map(function(weatherInformation) {
    return (
        <WeatherIn city={weatherInformation.city} weatherImg={weatherInformation.weatherImg}
          temperature={weatherInformation.temperature} key={weatherInformation.id}>
        </WeatherIn>
      );
    });
    return (
      <div className="weather_app--list_of_cities">
        {weatherNodes}
      </div>
    );
  }
});


var WeatherIn = React.createClass({
  render: function() {
    return (
      <li>
        <p>{this.props.city}</p>
        <p>{this.props.temperature}</p>
        <p><img src={this.props.weatherImg}/></p>
      </li>
    );
  }
});


ReactDOM.render(
  <WeatherContent/>,
  document.getElementById('weather')
);