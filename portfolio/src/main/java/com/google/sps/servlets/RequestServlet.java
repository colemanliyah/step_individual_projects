package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
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

@WebServlet("/data")
public class RequestServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        FetchOptions fetchOptions = FetchOptions.Builder.withLimit(5);

        String startCursor = request.getParameter("cursor");
        System.out.println(startCursor);
        if (startCursor != null) {
            fetchOptions.startCursor(Cursor.fromWebSafeString(startCursor));
        }

        Query query = new Query("Task");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery pq = datastore.prepare(query);

        QueryResultList<Entity> results;
        try {
            results = pq.asQueryResultList(fetchOptions);
        } catch (IllegalArgumentException e) {
            response.sendRedirect("/index");
            return;
        }

        String cursorString = results.getCursor().toWebSafeString();      

        List<Object> fetchable_elements = new ArrayList<Object>();
        fetchable_elements.add(results);
        fetchable_elements.add(cursorString);

        Gson gson = new Gson();

        response.setContentType("application/json;");
        response.getWriter().println(gson.toJson(fetchable_elements));

    }

}