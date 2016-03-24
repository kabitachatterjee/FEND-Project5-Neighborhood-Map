/*Javascript containing all functions to call national parks data from Firebase and nearest airports data from
SITA API and displaying them using Google Maps API */


var markers = [];
function googleError(){
    alert("Google Maps Loading failed!");
}
      function initMap() {
        var bounds = new google.maps.LatLngBounds();
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          zoom: 14,
          mapTypeId: 'roadmap',
          mapTypeControl: false,
        disableDefaultUI: true
        });
        if($(window).width() <= 1080) {
        map.setZoom(16);
    }
    

    function resetMap() {
        var windowWidth = $(window).width();
        if(windowWidth <= 1080) {
            map.setZoom(3);
            map.setCenter(map.center);
        } else if(windowWidth > 1080) {
            map.setZoom(4);
            map.setCenter(map.center);   
        }
    }
   $(window).resize(function() {
        resetMap();
    }); 
    map.fitBounds(bounds);

    var parksRequestTimeout = setTimeout(function(){
               alert("failed to get national parks data");
    },8000);
      $.ajax({
        url: 'https://usnationalparks.firebaseio.com/parks.json',
        dataType: 'jsonp',
        success: function(loc){
        for (var i = 0; i< loc.length; i++){
        var position = new google.maps.LatLng(loc[i].lat, loc[i].lng);
        bounds.extend(position);

        var content = '<img height="50" width="50" src="' + loc[i].image + 
                                    '" alt="Image of ' + loc[i].name + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    loc[i].name+ ','+loc[i].state+'</strong><br><p>'+'<a class="web-links" href="'+loc[i].url+'" target="_blank">'+loc[i].url+
                                    '<p>Nearest airport:</p>';

        var infowindow = new google.maps.InfoWindow({
                         content: content
                        });


        loc[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(loc[i].lat, loc[i].lng),
          map: map,
          title: loc[i].name,
          icon: {
            url: 'img/tree.png',
            size: new google.maps.Size(50, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            }
        });
        markers.push(loc[i].holdMarker);

      map.fitBounds(bounds);
      clearTimeout(parksRequestTimeout);
     
      new google.maps.event.addListener(loc[i].holdMarker, 'click', (function(marker, i) {
       
          return function() {
            var airportUrl = 'https://airport.api.aero/airport/nearest/'+loc[i].lat+'/'+loc[i].lng+'?user_key=b26562a6792b0ee4bc5c786291c86714';
            var airRequestTimeout = setTimeout(function(){
               alert('Failed to get airports data');

                  },8000);
             $.ajax({
                  url: airportUrl,
                  dataType: 'jsonp',
                  success: function(data){
             
       
            var content = '<img height="250" width="350" src="' + loc[i].image + 
                                    '" alt="Image of ' + loc[i].name + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    loc[i].name+ ', '+loc[i].state+'</strong><br><p>'+'<a class="web-links" href="'+loc[i].url+'" target="_blank">'+loc[i].url+
                                    '</a><h5><img height="20" width="20" src="img/Black_Plane.png">'+data.airports[0].name+','+data.airports[0].city+
                                    ' <img height="20" width="20" src="img/time.png">'+data.airports[0].timezone+'</h5>';

                                    

            infowindow.setContent(content);
            infowindow.open(map,marker);
            google.maps.event.addListener(infowindow,'closeclick',function(){
             
             resetMap();
            });
            var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(9);
            } else if(windowWidth > 1080) {
                map.setZoom(10);  
            }
            map.setCenter(marker.position);
            loc[i].picBoolTest = true;
           clearTimeout(airRequestTimeout);
            }
        });
          }; 
          })(loc[i].holdMarker, i));

}

  
//Click nav element to zoom in and center location on click
var viewModel = {
    query: ko.observable(''),                  
    filteredList : ko.observableArray(markers), 
    clickOpenMap: function(marker){
        $('#input').val('');
        var position = new google.maps.LatLng(marker.lat, marker.lng) ;  
        var location = new google.maps.Marker({
          position: position,
          map: map,
          title: marker.name,
          icon: {
            url: 'img/tree.png',
            size: new google.maps.Size(50, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            }
        });
    var airportUrl = 'https://airport.api.aero/airport/nearest/'+marker.lat+'/'+marker.lng+'?user_key=b26562a6792b0ee4bc5c786291c86714';
            var airRequestTimeout2 = setTimeout(function(){
               alert('Failed to get airports data');

                  },8000);
             $.ajax({
                  url: airportUrl,
                  dataType: 'jsonp',
                  success: function(data){
    var content = '<img height="250" width="350" src="' + marker.image + 
                                    '" alt="Image of ' + marker.name + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    marker.name+ ', '+marker.state+'</strong><br><p>'+'<a class="web-links" href="'+marker.url+'" target="_blank">'+marker.url+
                                    '</a><h5><img height="20" width="20" src="img/Black_Plane.png">'+data.airports[0].name+','+data.airports[0].city+
                                    ' <img height="20" width="20" src="img/time.png">'+data.airports[0].timezone+'</h5>';
    clearTimeout(airRequestTimeout2);
    map.panTo(location.position);
    infowindow.setContent(content);
    infowindow.open(map,location);
    map.setZoom(10); 
     new google.maps.event.addListener(infowindow,'closeclick',function(){
             location.setMap(null);
             resetMap();
             window.location.reload(true);
            });
   }
 });
},
closeOpenList: function(){                   //Hide and Show entire Nav/Search Bar on click
 var imgNav = $('#arrow').attr('src');       // Hide/Show Bound to the arrow button
 function noNav() {
    $('#search-nav').hide();
    $('#arrow').attr('src', 'img/down-arrow.gif'); 
}
function yesNav() {
    $('#search-nav').show();
    $('#arrow').attr('src', 'img/up-arrow.gif');
            var scrollerHeight = $('#scroller').height() + 55;       //Nav is repsonsive to smaller screen sizes
            if($(window).height() < 600) {
                $('#search-nav').animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css('max-height', 439);
                });  
            } else {
            $('#search-nav').animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css('max-height', 549);
            });
            }
            $('#arrow').attr('src', 'img/up-arrow.gif');
}

function hideNav() {
    if(imgNav === "img/up-arrow.gif") {
            noNav();
            
    } else {
            yesNav();  
    }
}
hideNav();

}
    
};

// filter search locations in the list view
viewModel.loc = ko.computed(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(loc, function(marker) {
    
      if (marker.name.toLowerCase().indexOf(search) >= 0){
            
            marker.visible = true;
            return marker.visible;
        } 
        else {
            
             marker.visible = false;
            return marker.visible;
        }
    
    });       
},viewModel);

// filter map markers with list view

viewModel.filterMarkers = ko.computed(function() {
    var self = this;
    var pin = self.filteredList();
    for (var i=0; i < pin.length; i++){
      var mypark = self.query().toLowerCase();
      if(pin[i].title.toLowerCase().indexOf(mypark) >= 0){
         pin[i].setMap(map);
       }
    else{
      pin[i].setMap(null);
      
    }
   }

},viewModel);

ko.applyBindings(viewModel);

}
});
}
   
    