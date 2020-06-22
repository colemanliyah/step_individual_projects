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

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    
    ArrayList<TimeRange> validTimes = new ArrayList<TimeRange>();
    Collection<String> wantedAttendees = request.getAttendees();
    ArrayList<TimeRange> occupiedTimes = new ArrayList<TimeRange>();

    TimeRange whole_day = TimeRange.WHOLE_DAY;

    if(wantedAttendees.isEmpty()){
        occupiedTimes.add(whole_day);
        return occupiedTimes;
    }

    if(request.getDuration() > whole_day.duration()) {
        return validTimes;
    }

    if(wantedAttendees.size() == 0) {
        validTimes.add(whole_day);
        return validTimes;
    }

    for(Event schedule : events) {
        Collection<String> busyAttendees = new ArrayList<>();
        busyAttendees = schedule.getAttendees();

        for(String person:wantedAttendees) {
            if(busyAttendees.contains(person)) {
                occupiedTimes.add(schedule.getWhen());
            }
        }
    }

    if(occupiedTimes.size()==0) {
        validTimes.add(whole_day);
        return validTimes;
    }

    Collections.sort(occupiedTimes, TimeRange.ORDER_BY_START);

    System.out.println(occupiedTimes);
    System.out.println("something nice");
    TimeRange marker = TimeRange.START;
    if(occupiedTimes.size()==1 || occupiedTimes.size() == 2) {
        for(int i=0; i<occupiedTimes.size(); i++){
            // if(occupiedTimes.get(i).contains(occupiedTimes.get(i+1) && marker!=TimeRange.START && (i+1) != occupiedTimes.size()-1){
            //     validTimes.add(occupiedTimes.get(i).end(), occupiedTimes.get(i+2).start(), true);
            // }
            if(occupiedTimes.get(i).start()-marker.end() >= request.getDuration()){
                validTimes.add(TimeRange.fromStartEnd(marker.end(), occupiedTimes.get(i).start()-1, true));
            }
            if((i+1) == occupiedTimes.size() && (whole_day.end() - occupiedTimes.get(i).end()) >= request.getDuration()) {
            validTimes.add(TimeRange.fromStartEnd(occupiedTimes.get(i).end(), whole_day.end()-1, true));
            }
            marker = occupiedTimes.get(i);
        }
        return validTimes;
    }
    
    marker = TimeRange.START;
    for(int i=0; i < occupiedTimes.size()-1; i ++) {
        // if(occupiedTimes.get(i).contains(occupiedTimes.get(i+1) && marker!=TimeRange.START && (i+1) != occupiedTimes.size()-1){
        //     validTimes.add(occupiedTimes.get(i).end(), occupiedTimes.get(i+1), true);
        // }
        if(occupiedTimes.get(i).overlaps(occupiedTimes.get(i+1)) && marker!= TimeRange.START){
            marker = occupiedTimes.get(i+1);
        } else if(occupiedTimes.get(i).start()-marker.end() >= request.getDuration()){
            validTimes.add(TimeRange.fromStartEnd(marker.start(), occupiedTimes.get(i).start()-1, true));
            marker = occupiedTimes.get(i);
        }
        if((i+1) == occupiedTimes.size()-1 && (whole_day.end() - occupiedTimes.get(i+1).end()) >= request.getDuration()) {
            validTimes.add(TimeRange.fromStartEnd(occupiedTimes.get(i+1).end(), whole_day.end()-1, true));
        }
    }

    System.out.println(occupiedTimes);
    System.out.println("debugging");
    System.out.println(validTimes);

    return validTimes;

  }
}
