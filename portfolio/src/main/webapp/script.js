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

let key_to_be_deleted = 0;
function fetchfunction(){
    fetch("/data").then(response => response.json()).then((tasks) => {
        for (i=0; i<tasks.length; i++) {
            if (tasks[i]["propertyMap"]["comment"] != null) {
                let node = document.createElement("div");
                node.innerText = tasks[i]["propertyMap"]["comment"] + "\n -- Date posted: "  + tasks[i]["propertyMap"]["time"] + "\n -- " + tasks[i]["propertyMap"]["name"] + "\n ";

                let delete_comment = document.createElement("IMG");
                delete_comment.src = "/images/deleteicon.png"
                delete_comment.classList.add("delete");
                delete_comment.innerHTML = "Delete";
                delete_comment.addEventListener("click", deleteTask);

                key_to_be_deleted = tasks[i]["key"]["id"];

                document.getElementById('comments_section').appendChild(node).appendChild(delete_comment);
            } 
        }
    });
}

function deleteTask(){
    let params = new URLSearchParams();
    params.append('id', key_to_be_deleted);
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

