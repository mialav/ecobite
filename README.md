# ecobite

[Ecobite](https://ecobite.herokuapp.com/) is the second bootcamp project at Ironhack created my Mia Lavanti and Jacqueline Chen.

## How ecobite works

The aim of Ecobite is to provide a platform for users to find the most ecofriendly restaurants in their vicinity by allocating a ecoscore for each restaurant based on user feedback, and placing these scores on the map and on a list.

The ecoscore for each restaurant is based on an algorithm created by the developers. A user can give feedback on a restaurant based on 5 categories: whether the restaurant uses single-use disposable products when dining in, whether the takeaway containers used by the restaurant are compostable, whether the restaurant offers a reusable cup program, whether the restaurant offers plant-based meals and whether there is a dairy alternative available. Each score is then weighted on a scale.

A user can only rate a restaurant once to prevent misuse, but the user is also able to go back and update a previous score they have given. Only logged in users can score restaurants, but anyone can browse restaurants.

Ecobite currently only works in Berlin.

## Technologies

Ecobite is built using Javascript, HTML/CSS, Handlebars, Node.js, Express, Passport, and the Mapbox and Foursquare APIs. 

I (Mia) contributed to both the backend and frontend, and worked extensively with the Mapbox API and the Foursquare APIs, as well as the scoring algorithm and routing. 

## Next steps

Next steps in this project are to continue tweaking the scoring algorithm based on research – currently the algorithm works, but is mainly dictated on what we find important. We also want to create a user profile so that users can track the restaurants they have scored, their favorite restaurants as well as how sustainable their restaurant visits have been. We want to color code the restaurants on the map based on sustainability. We also want to make the map view more dynamic and allow users to search and filter for specific restaurants or cuisines. The Foursquare API also currently limits the amount of search results visible, which is something that we also need to work on.

