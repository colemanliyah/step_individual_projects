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
let map=null;

function getComments(){
    fetch("/data").then(response => response.json()).then((tasks) => {
        if(tasks[2] == "true"){
            document.getElementById("comments_form").style.display = "block";
            document.getElementById("authentication").innerHTML = "Log Out";
        }
        else {
            document.getElementById("authentication").innerHTML = "Log In";
            document.getElementById("needSignIn").style.display = "block";
        }
        
        document.getElementById("authentication").style.display = "block";
        document.getElementById("authentication").href = tasks[1];

        for (i=0; i<tasks[0].length; i++) {
            if (tasks[0][i]["propertyMap"]["comment"] != null) {
                let node = document.createElement("div");
                node.innerText = tasks[0][i]["propertyMap"]["comment"] + "\n -- Date posted: "  + tasks[0][i]["propertyMap"]["time"] + "\n -- " + tasks[0][i]["propertyMap"]["name"] + ", " + tasks[0][i]["propertyMap"]["email"] + "\n ";

                let delete_comment = document.createElement("IMG");
                delete_comment.src = "/images/deleteicon.png"
                delete_comment.classList.add("delete");
                delete_comment.id = tasks[0][i]["key"]["id"];
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

function createMarkerWindow(marker, message, map) {
    let newInfoWindow = new google.maps.InfoWindow({
        content: message
    });
    newInfoWindow.open(map, marker);
} 

function createStaticMarker(lat_coord, lng_coord, map, heading) {
    let staticMarker = new google.maps.Marker({
        position: {lat: lat_coord, lng: lng_coord},
        map: map,
        title: heading,
    });
    return staticMarker;
}

function createMap() {
    map = new google.maps.Map(
    document.getElementById('map'),
    {center: {lat: 37.422, lng: -122.084}, zoom: 4, mapTypeId: 'hybrid'});

    let homeMarker = createStaticMarker(34.049, -111.094, map, "My Home State!");
    homeMarker.addListener('click', function() {createMarkerWindow(homeMarker, "<h6> Phoenix </h6>" + "</br>" + "<p>I have grown up in Arizona all my life. I lived in Virgina for three months when I was eight because my dad is from there but otherwise I have only lived in AZ</p>", map)});

    let travelMarker = createStaticMarker(41.872, 12.567, map);
    travelMarker.addListener('click', function(){createMarkerWindow(travelMarker, "<h6> Italy </h6> " + "</br>" + "<p> If I could go anywhere in the world, I would go to Italy. I have never been there before </p>", map)});

    let firstTimeGoogle = createStaticMarker(47.606, -122.332, map);
    firstTimeGoogle.addListener('click', function() {createMarkerWindow(firstTimeGoogle, "<h6> Seattle </h6>" + "</br>" + "<p> My first experience being at Google was here in Seattle the summer of 2019!</p>", map)});
}

function checkUserMarkerGuess() {
    let hidden_coordinates = [["37", "-76"],["33","-118"], ["34","-118"]];
    let lat_guess = document.getElementById("lat").value;
    let lng_guess = document.getElementById("lng").value;
    let answer = "";
    for (let i=0; i<hidden_coordinates.length; i++){
        if (JSON.stringify(hidden_coordinates[i]) == JSON.stringify([lat_guess, lng_guess])){
            answer = "Yes, I have been there! See the marker add to the Map";
            let visited_place = createStaticMarker(parseInt(lat_guess),parseInt(lng_guess),map,"Place I have Visited!");
        }
    }
    if (answer.localeCompare("")){
        document.getElementById("answer").innerText = answer;
    } else {
        document.getElementById("answer").innerText = "Sorry, no I have not been there yet. Try Again!";
    }
    event.preventDefault();
}

function getHints() {
  let hint = ["I've been to a city in the state that is considered the 'mother of states'", "I've been to the city the movie 'Freedom Writers' is located in", "I've been to the city nicknamed 'the Bu' "];
  let randomHint = hint[Math.floor(Math.random() * hint.length)];
  let hint_container = document.getElementById('hint_container');
  hint_container.innerText = randomHint;
}