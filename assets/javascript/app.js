/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
     // Rotating jumbotron image
    var bgImages = ['NCFC-Food-Image.jpg', 'health-club-fitness-gandainsurance.com_1.jpg', 'spa4.jpg', 'nightClub.jpg'];
    $('.jumbotron').css({'background-image': 'url(assets/images/' + bgImages[Math.floor(Math.random() * bgImages.length)] + ')'});

    // Lightbox that is created when results are clicked on
    $('.fancybox').fancybox();

    // Chat feature
    $('#chat').click(function () {

         window.open('chat.html','mywindow','width=300,height=510,menubar=no')

    });

           // Flickr API 
        
        function InitialGetPhotos(topic){
        
        $("#flickr-health").empty();
        // var flickrAddress = document.getElementById("gmap_where").value;
        var flickrTerms = document.getElementById("gmap_type").value;
        var key = 'e5e2d96687a4f74ca27bf5310b68df5b';
        var flickrApiUrl = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&user_id=61495424@N00&api_key=" + key + "&tags=" + flickrTerms + "&per_page=30&format=json&jsoncallback=?";
  
            $.ajax({
                url: flickrApiUrl,
                method: "GET",
                // data: request,
                dataType: "jsonp",
                success: function(flickrData){
                    console.log(flickrData);
                    var i;
                    for(var i=0; i<9; i++){

                    var photosFind = flickrData.photos.photo[i];
                    var photosFindUrl = 'https://farm'+ photosFind.farm + '.staticflickr.com/' + photosFind.server + '/' + photosFind.id + '_' + photosFind.secret +'.jpg';
                    var photoZoom = $('<a href="' + photosFindUrl + '">').addClass('fancybox');
                    var photoElem = $('<img src="' + photosFindUrl + '">').addClass('flickrImages');
   
                    $('#flickr-health').append(photoElem);
                    $('#flickr-health').append(photoZoom); 
                    photoZoom.append(photoElem);

                    };
                },
                error: function(){console.log('it failed')}
            })
        };
        $('#searchYelp').on('click', function() {

            InitialGetPhotos();

        });


    // =========Start recipe API=========
    var recipes = [];

     $( "#findRecipies" ).click(function() {
        var searchFeature = document.getElementById("formValueId").value;
        $(".searchResults").empty();

        (function($) {
        var url = 'https://api.edamam.com/search?q='+ searchFeature + '&app_id=2b7d9e16&app_key=4cb1f00ac92d7436b10d2e1cd2d38d8c&to=12';
        $.ajax({
           type: 'GET',
            url: url,
            async: false,
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(jsonData) {
                for (var i = 0; i < jsonData.hits.length; i++) {
                    var recipeSearchResults = {
                        label: jsonData.hits[i].recipe.label,
                        image: jsonData.hits[i].recipe.image,
                        source: jsonData.hits[i].recipe.source,
                        shareAs: jsonData.hits[i].recipe.shareAs,
                        // ingredientLines: jsonData.hits[i].recipe.ingredientLines
                    }
                        recipes.push(recipeSearchResults);
                        var divRecipeImage = $("<div class='recipeContainer'><a class='fancybox fancybox.iframe' href='"+ recipeSearchResults.shareAs +"'><img class='recipeSearchResultsImage' src='"+ recipeSearchResults.image +"'></a><p class='recipeLabel'>"+ recipeSearchResults.label +"</p><p class='recipeSource'>"+ recipeSearchResults.source +"</p></div>");
                        $(".searchResults").append(divRecipeImage);   
                };
            },
            error: function(e) {
               console.log(e.message);
            }
        });

        })(jQuery);
    });
    // =========End recipe API=========

    // =========Start voice recognition API=========
     $( "#startDictation" ).click(function() {
        debugger;
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
     
          var recognition = new webkitSpeechRecognition();
     
          recognition.continuous = false;
          recognition.interimResults = false;
     
          recognition.lang = "en-US";
          recognition.start();
     
          recognition.onresult = function(e) {
            document.getElementById('formValueId').value
                                     = e.results[0][0].transcript;
            recognition.stop();
            // document.getElementById('labnol').submit();
          };
     
          recognition.onerror = function(e) {
            recognition.stop();
          }     
        }
    });
    // =========End voice recognition API=========
});


// =========Start Google Places API=========
var geocoder;
var map;
var markers = new Array();
var infos = new Array();

function initialize() {
    // prepare Geocoder
    geocoder = new google.maps.Geocoder();

    // set initial position (RCB)
    var myLatlng = new google.maps.LatLng(40.7191114,-74.0328205);
    var myOptions = { // default map options
        zoom: 16,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
}

// clear overlays function
function clearOverlays() {
    if (markers) {
        for (var i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}

// clear infos function
function clearInfos() {
    if (infos) {
        for (var i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}

// find address function
function findAddress() {
    var address = document.getElementById("gmap_where").value;

    // script uses our 'geocoder' in order to find location by address name
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok

            // we will center map
            var addrLocation = results[0].geometry.location;
            map.setCenter(addrLocation);

            // store current coordinates into hidden variables
            // document.getElementById('lat').value = results[0].geometry.location.Xa;
            // document.getElementById('lng').value = results[0].geometry.location.Ya;
            document.getElementById('lat').value = results[0].geometry.location.lat();
            document.getElementById('lng').value = results[0].geometry.location.lng();

            // and then - add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: 'assets/images/mapMarker.png'
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// find custom places function
function findPlaces() {

    // prepare variables (filter)
    var type = document.getElementById('gmap_type').value;
    var radius = document.getElementById('gmap_radius').value;
    // var keyword = document.getElementById('gmap_keyword').value;

    // Set default search location based on lat/lng passed from index page.
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
        location: cur_location,
        radius: radius,
        types: [type]
    };
    // if (keyword) {
    //     request.keyword = [keyword];
    // }

    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
}

// create markers (from 'findPlaces' function)
function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we have found something - clear map (overlays)
        clearOverlays();

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        // alert('Sorry, nothing is found');
    }
}

// creare single marker function
function createMarker(obj) {

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
    });
    markers.push(mark);

    // type of place info window
    var infowindow = new google.maps.InfoWindow({
        content: '<div id="infowindowPhoto"><img src="' + obj.icon + '" /></div><div id="infowindowData"><font style="color:#000;">' + obj.name + 
        '<br />Rating: ' + obj.rating + '<br />Address: ' + obj.vicinity + '</font></div>'
    });

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        clearInfos();
        infowindow.open(map,mark);
    });
    infos.push(infowindow);
}

// initialization
google.maps.event.addDomListener(window, 'load', initialize);
// =========End Places API=========

// =========Start Geolocation API=========
function writeAddressName(latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
        "location": latLng
    },
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
            document.getElementById("gmap_where").value = results[0].formatted_address;
        else
            document.getElementById("error").innerHTML += "Unable to retrieve your address" + "<br />";
    });
}

function geolocationSuccess(position) {
    var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    // Write the formatted address
    writeAddressName(userLatLng);
    var myOptions = {
      zoom : 16,
      center : userLatLng,
      mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

    // Place the marker
    new google.maps.Marker({
        map: mapObject,
        position: userLatLng
    });

    // Draw a circle around the user position to have an idea of the current localization accuracy
    var circle = new google.maps.Circle({
        center: userLatLng,
        radius: position.coords.accuracy,
        map: mapObject,
        fillColor: '#0000FF',
        fillOpacity: 0.5,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0
    });
    mapObject.fitBounds(circle.getBounds());
}

function geolocationError(positionError) {
    document.getElementById("error").innerHTML += "<div>" + positionError.message + "</div><br />";
}

function geolocateUser() {
    // If the browser supports the Geolocation API
    if (navigator.geolocation){
        var positionOptions = {
        enableHighAccuracy: true,
        timeout: 10 * 1000 // 10 seconds
      };
      navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
    }else
      document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
}

window.onload = geolocateUser;
// =========End Google Geolocation API=========

// =========Start Yelp API=========
function restaurantFinder() {

    var yelpAddress = document.getElementById("gmap_where").value;
    var yelpTerms = document.getElementById("gmap_type").value;
    $(".searchResults").empty();

    var auth = {
        consumerKey: '5TBzLTyOV4OVhUrzGgaVBQ', 
        consumerSecret: 'ag4xe5h3-ZGe3huiPQr1j5kX3LE',
        accessToken: 'W2ILo6yUGiwfB4gsmEH8rvBqQjcwNGQh',
        accessTokenSecret: 'yNyEskFCaeehJwzCYJGrNCENtLU',
        serviceProvider: {
        signatureMethod: "HMAC-SHA1"
        }
    };
    var terms = yelpTerms;
    var near = yelpAddress;
    var limit = 12;
    var image_url = 'image_url';
    var rating_img_url_large = 'rating_img_url_large';
    var phone = 'phone';
    var yelpUrl = 'url';

    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    };

    parameters = [];
    parameters.push(['url', yelpUrl]);
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['limit', limit]);
    parameters.push(['image_url', image_url]);
    parameters.push(['rating_img_url_large', rating_img_url_large]);
    parameters.push(['phone', phone]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


    var message = {
      'action': 'http://api.yelp.com/v2/search',
      'method': 'GET',
      'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
    var bestRestaurant = "Some random restaurant";

    $.ajax({
      'url': message.action,    
      'method': 'GET',
      'data': parameterMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'cb',
      'success': function(data, textStats, XMLHttpRequest) {

        // =====This code will print data on the page=========
            var i;
            for(var i=0; i<12; i++){

            var yelpDiv = $('<div>').addClass('restaurantBox');

            var yelpUrlHref = $('<a>').attr('href', data.businesses[i].url).addClass('fancybox fancybox.iframe');

            var img = $('<img>').attr('src', data.businesses[i].image_url).addClass('imageDisplay');

            yelpUrlHref.append(img);

            yelpDiv.append(yelpUrlHref);    

            var bizName = $('<br /><p>').text(data.businesses[i].name).addClass('yelpLabel');
            yelpDiv.append(bizName);

            var ratingImg = $('<img>').attr('src', data.businesses[i].rating_img_url_large).addClass('yelpRating')
            yelpDiv.append(ratingImg);

            var phoneNum = $('<br /><span>').text(data.businesses[i].phone).addClass('yelpPhone')
            yelpDiv.append(phoneNum);

            $(".yelpPhone").text(function(i, text) {
                text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
                return text;
            });

            $('.searchResults').append(yelpDiv);  

            };
        },
    });
};
// =========End Yelp API=========