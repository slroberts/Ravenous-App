const clientId = '2ZKJthoX0VF7h-WHBPhQwQ';
const secret = 'elv4tawYAoism2tyCXbMAC8Unf1xvilMiLXBtiTm7wjouogbi66OQzACM1roqPae';
let accessToken;

//Yelp Module
let Yelp = {

  //This method is necessary to retrieve an access token from the Yelp API
  //so that you can authenticate your requests and retrieve data.
  getAccessToken() {

    //This will allow us to know whether or not we need to request a new access token.
    if(accessToken) {

      //We already have an access token and just need to return a promise that
      //will instantly resolve to that access token (if we don't return a promise,
      //other methods that chain off this method won't work properly).
      return new Promise(resolve => resolve(accessToken));

    }

    //If the initial condition is not true, we will need to make a POST request
    //to the Yelp API to receive and set our access token. We will make a request
    //to the /token endpoint of the Yelp API and pass in our client ID and secret
    //to obtain our access token.

    //bypass CORS restriction with an API called "CORS Anywhere".
    //Prepend the URL path you passed to the first argument in fetch()
    //with the following: https://cors-anywhere.herokuapp.com/

    return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`, {

      //convert the returned response to JSON for us to be able to retrive the access token.
      method: 'POST'}).then(response => {

        return response.json();

        //we can retrieve the returned access token and set in our accessToken variable.
      }).then(jsonResponse => {

        accessToken = jsonResponse.access_token;

      });

  },

  //This is the method we'll use to retrieve search results from the Yelp API.
  search(term, location, sortBy) {

    //Return a promise that will ultimately resolve to our list of businesses.
    return Yelp.getAccessToken().then( () => {

        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {

          headers: {

            Authorization: `Bearer ${accessToken}`

          }
        });

      }).then(response => {

        return response.json();

      }).then(jsonResponse => {

        //If this key does exists in the JSON response, we should return an array that has all of the business'
        //properties we'll need (the ones we previously hard coded, like name, address, city, and more).

        if(jsonResponse.businesses) {

          return jsonResponse.businesses.map( business => ({

            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address1,
            city: business.location.city,
            state: business.location.state,
            zipCode: business.location.zip_code,
            category: business.categories[0].title,
            rating: business.rating,
            reviewCount: business.review_count

          })

          );

        }

      });

  }

}
export default Yelp;
