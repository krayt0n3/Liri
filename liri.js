require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require("moment");
var omdbApi = require('omdb-client');

inquirer
  .prompt([
    
    // Here we give the user a list to choose from.
    {
      type: "checkbox",
      message: "What do you want to do?",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "action"
    }

    // Here we ask the user to confirm.
  ])
  .then(inquirerResponse => {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if ((inquirerResponse.action.toString()) === 'concert-this') {
        inquirer
            .prompt([

    {
        type: "input",
        message: "Who are you searching for?",
        name: "artist"
      }

  ])
  .then(inquirerInput => {
        axios.get("https://rest.bandsintown.com/artists/" + inquirerInput.artist + "/events?app_id=codingbootcamp").then(
            function(response) {
              // Then we print out the imdbRating
              
                console.log((response.data[0].venue.name) + ' ' + (response.data[0].venue.city) + ', ' + (response.data[0].venue.region) + ' ' + ((moment(response.data[0].datetime)).format('MMMM Do YYYY, h:mm:ss a')));
              
            })
        });
    } else if ((inquirerResponse.action.toString()) === 'spotify-this-song') {
        inquirer
            .prompt([

    {
        type: "input",
        message: "What song do you like?",
        name: "track"
      }

  ])
  .then(inquirerchoice => {

        spotify
  .search({ type: 'track', query: inquirerchoice.track, limit: 5})
  .then(function(response) {
    console.log((response.tracks.items[0].album.artists[0].name) + ', ' + (response.tracks.items[0].name) + ', ' + (response.tracks.items[0].external_urls.spotify) + ', ' + (response.tracks.items[0].album.name));
  })
  .catch(function(err) {
    console.log(err);
  });
    })} else if(inquirerResponse.action.toString() === 'movie-this') {
        inquirer
            .prompt([

    {
        type: "input",
        message: "What movie do you like?",
        name: "movie"
      }

  ])
  .then(inquirerTime => {
    var output = function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);	
        }
    };
    var params = {
        apiKey: '7b10ab68',
        title: inquirerTime.movie
    }
    omdbApi.get(params, function(err, data) {
        console.log(data.Title + ', ' + data.Year + ', ' + data.imdbRating + ', ' + data.Country + ', ' + data.Language + ', ' + data.Plot + ', ' + data.Actors);
    });
    })}
    else {
      console.log("\nThat's okay, come again when you are more sure.\n");
    }
  });