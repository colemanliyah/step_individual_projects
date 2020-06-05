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
let cursor = "";

function getComments(){
    fetch("/data").then(response => response.json()).then((tasks) => {
        cusor = tasks[1];
        for (i=0; i<tasks[0].length; i++) {
            if (tasks[0][i]["propertyMap"]["comment"] != null) {
                let node = document.createElement("div");
                node.innerText = tasks[0][i]["propertyMap"]["comment"] + "\n -- Date posted: "  + tasks[0][i]["propertyMap"]["time"] + "\n -- " + tasks[0][i]["propertyMap"]["name"] + "\n ";

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

function loadMoreComments(){
    let cursor_value = document.createElement("P");
    //cursor_value.name = 'cursor';
    cursor_value.innerText = cursor; 
    document.getElementById("cursor_placeholder").appendChild(cursor_value);
    console.log(cursor_value.innerText);
}

function deleteComment(key){
    let params = new URLSearchParams();
    params.append('id', key);
    fetch("/deleteData", {method: 'POST', body: params}).then(() => {
        console.log("need to refresh now");
    });
}

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

