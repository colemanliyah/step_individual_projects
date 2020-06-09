// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function getComments(){
    fetch("/data").then(response => response.json()).then((tasks) => {
        for (i=0; i<tasks.length; i++) {
            if (tasks[i]["propertyMap"]["comment"] != null) {
                let node = document.createElement("div");
                node.innerText = tasks[i]["propertyMap"]["comment"] + "\n -- Date posted: "  + tasks[i]["propertyMap"]["time"] + "\n -- " + tasks[i]["propertyMap"]["name"] + "\n ";

                let delete_comment = document.createElement("IMG");
                delete_comment.src = "/images/deleteicon.png"
                delete_comment.classList.add("delete");
                delete_comment.id = tasks[i]["key"]["id"];
                delete_comment.addEventListener("click", function(){deleteComment(delete_comment.id)});

                document.getElementById('comments_section').appendChild(node).appendChild(delete_comment);
            } 
        }
    });
}

function deleteComment(key){
    let params = new URLSearchParams();
    params.append('id', key);
    fetch("/deleteData", {method: 'POST', body: params}).then(() => {
        console.log("need to refresh now");
    });
}

let map=null;
function createMap() {
    map = new google.maps.Map(
    document.getElementById('map'),
    {center: {lat: 37.422, lng: -122.084}, zoom: 4, mapTypeId: 'hybrid'});

    let homeMarkerInfo = new google.maps.InfoWindow({
        content: "<h6> Phoenix </h6>" + "</br>" + "<p>I have grown up in Arizona all my life. I lived in Virgina for three months when I was eight because my dad is from there but otherwise I have only lived in AZ</p>"
    });

    let homeMarker = new google.maps.Marker({
        position: {lat: 34.049, lng: -111.094},
        map: map,
        title: "My Home State"
    });

    homeMarker.addListener('click', function() {
        homeMarkerInfo.open(map, homeMarker);
    });

    let travelMarkerInfo = new google.maps.InfoWindow({
        content: "<h1> Italy </h1> " + "</br>" + "<p> If I could go anywhere in the world, I would go to Italy. I have never been there before </p>"
    })

    let travelMarker = new google.maps.Marker({
        position: {lat: 41.872, lng: 12.567},
        map:map,
    });

    travelMarker.addListener('click', function(){
        travelMarkerInfo.open(map, travelMarker);
    });

    firstTimeGoogleInfo = new google.maps.InfoWindow({
        content: "<h6> Seattle </h6>" + "</br>" + "<p> My first experience being at Google was here in Seattle the summer of 2019!</p>"
    });

    let firstTimeGoogle = new google.maps.Marker({
        position: {lat: 47.606, lng: -122.332},
        map:map,
    });

    firstTimeGoogle.addListener('click', function(){
        firstTimeGoogleInfo.open(map, firstTimeGoogle);
    });
}

let places_been = [["37", "-76"],["33","-118"], ["34","-118"]];
function createMarkers() {
    let lat_guess = document.getElementById("lat").value;
    let lng_guess = document.getElementById("lng").value;
    let temp ="";
    for (let i=0; i<places_been.length; i++){
        if (JSON.stringify(places_been[i]) == JSON.stringify([lat_guess, lng_guess])){
            temp = "Yes, I have been there! See the marker add to the Map";
            let visited_place = new google.maps.Marker({
                position: {lat: parseInt(lat_guess), lng: parseInt(lng_guess)},
                map:map,
                title: "Place I have Visited!"
                });
        }
    }
    if (temp.localeCompare("")){
        document.getElementById("answer").innerText = temp;
    } else {
        document.getElementById("answer").innerText = "Sorry, no I have not been there yet. Try Again!";
    }
    event.preventDefault();
}

function hints() {
  let hint = ["I've been to a city in the state that is considered the 'mother of states'", "I've been to the city the movie 'Freedom Writers' is located in", "I've been to the city nicknamed 'the Bu' "];
  let randomHint = hint[Math.floor(Math.random() * hint.length)];
  let hint_container = document.getElementById('hint_container');
  hint_container.innerText = randomHint;
}