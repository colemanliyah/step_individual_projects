package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Cursor;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/data")
public class RequestServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();

        String authenticationUrl = "";
        Boolean loggedin = userService.isUserLoggedIn();
        if(!loggedin){
            authenticationUrl = userService.createLoginURL("/index.html");
        } else {
            authenticationUrl = userService.createLogoutURL("/index.html");
        }
        
        FetchOptions fetchOptions = FetchOptions.Builder.withLimit(5);

        Query query = new Query("Task");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery pq = datastore.prepare(query);

        QueryResultList<Entity> comments;
        try {
            comments = pq.asQueryResultList(fetchOptions);
        } catch (IllegalArgumentException e) {
            response.sendRedirect("/data");
            return;
        }

        Map<String, Object> fetchable_items = new HashMap();
        fetchable_items.put("comments", comments);
        fetchable_items.put("authenticationUrl", authenticationUrl);
        fetchable_items.put("loggedin", loggedin);

        Gson gson = new Gson();
        Type gsonType = new TypeToken<HashMap>(){}.getType();

        response.setContentType("application/json;");
        response.getWriter().println(gson.toJson(fetchable_items, gsonType));

    }

}