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

    if(wantedAttendees.size() == 0) {
        validTimes.add(whole_day);
        return validTimes;
    }

    if(request.getDuration() > whole_day.duration()) {
        return validTimes;
    }

    for(Event schedule : events) {
        Collection<String> busyAttendees = schedule.getAttendees();

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

    TimeRange marker = TimeRange.START;

    for(TimeRange meeting : occupiedTimes){
        if(meeting.start() > marker.end() && meeting.start()-marker.end() >= request.getDuration()) {
            validTimes.add(TimeRange.fromStartEnd(marker.end(), meeting.start()-1, true));
        }
        if(marker.end() < meeting.end()) {
            marker = meeting;
        }
    }
    if(marker.end()!=whole_day.end() && whole_day.end()-marker.end()>=request.getDuration()){
        validTimes.add(TimeRange.fromStartEnd(marker.end(), whole_day.end()-1, true));
    } 

    return validTimes;

  }
}
