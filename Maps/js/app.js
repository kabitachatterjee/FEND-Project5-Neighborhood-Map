
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
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
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

       $.getJSON('https://usnationalparks.firebaseio.com/parks.json',function(loc){
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
            size: new google.maps.Size(100, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            }
        });

      map.fitBounds(bounds);
     
      new google.maps.event.addListener(loc[i].holdMarker, 'click', (function(marker, i) {
       
          return function() {
            var airportUrl = "https://airport.api.aero/airport/nearest/"+loc[i].lat+"/"+loc[i].lng+"?user_key=b26562a6792b0ee4bc5c786291c86714";

             $.getJSON(airportUrl, function(data) {
       
            var content = '<img height="250" width="350" src="' + loc[i].image + 
                                    '" alt="Image of ' + loc[i].name + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    loc[i].name+ ', '+loc[i].state+'</strong><br><p>'+'<a class="web-links" href="'+loc[i].url+'" target="_blank">'+loc[i].url+
                                    '</a><h5><img height="20" width="20" src="img/Black_Plane.png">'+data.airports[0].name+','+data.airports[0].city+
                                    ' <img height="20" width="20" src="img/time.png">'+data.airports[0].timezone+'</h5>';
                                    

            infowindow.setContent(content);
            infowindow.open(map,marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            new google.maps.event.addListener(infowindow,'closeclick',function(){
             marker.setAnimation(null);
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
            });
          }; 
          
      
        })(loc[i].holdMarker, i));

     
      //Click nav element to view infoWindow
     //zoom in and center location on click

        var searchNav = $('#nav' + i);
        var search = searchNav.selector;
        console.log(search);
        console.log(loc[i].name);
        console.log(loc[i].holdMarker);
        $('#search-nav').on('click', 'a', function(marker){
                //console.log(id);
                console.log(search);
                console.log(marker);
               // if(this.id == search){
                return function(){
                 var content = '<img height="250" width="350" src="' + loc[i].image + 
                                    '" alt="Image of ' + loc[i].name + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    loc[i].name+ ', '+loc[i].state+'</strong><br><p>'+'<a class="web-links" href="'+loc[i].url+'" target="_blank">'+loc[i].url+
                                    '</a>';
            infowindow.setContent(content);
            infowindow.open(map,marker);
            map.setZoom(16);
            map.setCenter(marker.position);
            loc[i].picBoolTest = true;
            console.log('done'); 
           }  
        });
}
  
      //Query through the different locations from nav bar with knockout.js
    //only display markers and nav elements that match query result
var viewModel = {
    query: ko.observable(''),
};

viewModel.loc = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(loc, function(marker) {
      if (marker.name.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            marker.visible = true;
            
             return marker.visible;
        } else {
            marker.boolTest = false;
            
            marker.visible = false;
            return marker.visible;
        }
    });       
}, viewModel);


ko.applyBindings(viewModel);
});
}
     
      //Hide and Show entire Nav/Search Bar on click
    // Hide/Show Bound to the arrow button
    //Nav is repsonsive to smaller screen sizes
var isNavVisible = true;
function noNav() {
    $("#search-nav").animate({
                height: 0, 
            }, 500);
            setTimeout(function() {
                $("#search-nav").hide();
            }, 500);    
            $("#arrow").attr("src", "img/down-arrow.gif");
            isNavVisible = false;
}
function yesNav() {
    $("#search-nav").show();
            var scrollerHeight = $("#scroller").height() + 55;
            if($(window).height() < 600) {
                $("#search-nav").animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css("max-height", 439);
                });  
            } else {
            $("#search-nav").animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css("max-height", 549);
            });
            }
            $("#arrow").attr("src", "img/up-arrow.gif");
            isNavVisible = true;
}

function hideNav() {
    if(isNavVisible === true) {
            noNav();
            
    } else {
            yesNav();  
    }
}
$("#arrow").click(hideNav);

//Hide Nav if screen width is resized to < 850 or height < 595
//Show Nav if screen is resized to >= 850 or height is >= 595
    //Function is run when window is resized
$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 850 && isNavVisible === true) {
            noNav();
        } else if($(window).height() < 595 && isNavVisible === true) {
            noNav();
        }
    if ($(window).width() >= 850 && isNavVisible === false) {
            if($(window).height() > 595) {
                yesNav();
            }
        } else if($(window).height() >= 595 && isNavVisible === false) {
            if($(window).width() > 850) {
                yesNav();
            }     
        }    
});

    