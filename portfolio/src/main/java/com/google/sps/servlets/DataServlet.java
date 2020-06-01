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

package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
// @WebServlet("/data")
@WebServlet("/comments")
public class DataServlet extends HttpServlet {

  @Override
//   public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
//     String saying = "Hello Again";
//     ArrayList<String> messages = new ArrayList<String>();
//     messages.add("message one");
//     messages.add("message two");
//     messages.add("message three");
//     String json = convertToJsonUsingGson(messages);

//     response.setContentType("text/html;");
//     response.getWriter().println(json);
//   }

//   private String convertToJsonUsingGson(ArrayList<String> mes) {
//      Gson gson = new Gson();
//     String json = gson.toJson(mes);
//     return json;
//   }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
      ArrayList<String> messages = new ArrayList<String>();
      String text = getParameter(request, "comment", "");
      messages.add(text);
      response.setContentType("text/html;");
      response.getWriter().println(messages);
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
      String value = request.getParameter(name);
      if (value == null) {
          return defaultValue;
      }
      return value;
  }
}
