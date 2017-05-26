<?php

namespace App\Http\Controllers;

use App\Event;
use App\Member;
use App\Semester;
use App\EventType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Requests;

class OverviewController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function list_events(Request $request) {
        $show_inactive = $request->get('show_inactive');
        $start_date = $request->get('start_date');
        $end_date = $request->get('end_date');

        /*
         * Selects last 8 weeks if no dates are set, 8 weeks before end if only end is set,
         * and 8 weeks after start if only start is set.
         * Otherwise, uses provided dates.
         * */
        if($start_date == "" && $end_date == "") {
            $end_date = date("Y-m-d");
            $start_date = date("Y-m-d", strtotime("-" . 4 * 7 . "days")); // Date 4 weeks before today
        } else if($start_date == "") {
            $start_date = date("Y-m-d", strtotime($end_date . " -" . 4 * 7 . "days")); // Date 4 weeks before end
            $end_date = date("Y-m-d", strtotime($end_date));
        } else if($end_date == "") {
            $end_date = date("Y-m-d", strtotime($start_date . " +" . 4 * 7 . "days")); // Date 4 weeks after start
            $start_date = date("Y-m-d", strtotime($start_date));
        } else {
            $end_date = date("Y-m-d", strtotime($end_date));
            $start_date = date("Y-m-d", strtotime($start_date));
        }

        if($show_inactive)
            $members = Member::orderBy('first_name')->get();
        else
            $members = Member::where('active', true)->orderBy('first_name')->get();

        $events = Event::whereBetween('date', array($start_date, $end_date))->orderBy('date')->get();

        return view('overview.events', array('members' => $members, 'events' => $events, 'show_inactive' => $show_inactive,
                                        'start_date' => $start_date,
                                        'end_date' => $end_date));
    }

    public function inactive_members(Request $request) {
        $members = Member::where('active', true)->get();
        $inactive_members = array();
        $events = Event::orderBy('date', 'desc')->take(6)->get();
        foreach($members as $member) {
            $points = 0;
            foreach($events as $event) {
                if($member->is_present($event)) {
                    break;
                } else {
                    if($member->is_not_present($event)) {
                        $points += 0.5;
                    } else {
                        $points += 1.0;
                    }
                    if($points >= 3.0) {
                        array_push($inactive_members, $member);
                        break;
                    }
                }
            }
        }

        return view('overview.inactive', array('members' => $inactive_members));
    }

    public function top_members(Request $request) {
        if($request->has('semester')) {
            $chosen_semester = Semester::find($request->semester);
        } else {
            $chosen_semester = Semester::orderBy('end_date', 'desc')->first();
        }

        global $event_types;

        if($request->has('types')) {
            $event_types = $request->types;
        } else {
            $event_types = ['Øvelse'];
        }

        $query = DB::table('members')
                    ->select(DB::raw('first_name, last_name, COUNT(*) AS num_events'))
                    ->join('event_member', 'members.id', '=', 'member_id')
                    ->join('events', 'events.id', '=', 'event_id')
                    ->where('events.date', '>=', $chosen_semester->start_date)
                    ->where('events.date', '<=', $chosen_semester->end_date);

        $query->where(function($query) {
            global $event_types;
            $query->where('events.type', $event_types[0]);
            for($i = 1; $i < count($event_types); $i++) {
                $query->orWhere('events.type', $event_types[$i]);
            }
        });

        $query  ->groupBy('members.id', 'first_name', 'last_name')
                ->havingRaw('COUNT(*) > 0')
                ->orderBy('num_events', 'desc')
                ->orderBy('first_name');

        $members = $query->get();

        $semesters = Semester::orderBy('end_date', 'desc')->get();
        $types = EventType::all();

        return view('overview.toplist',
                    array('members' => $members, 'semesters' => $semesters,
                        'chosen_semester' => $chosen_semester, 'types' => $types, 'selected_types' => $event_types));
    }

    public function payment(Request $request) {
        $show_inactive = $request->get('show_inactive');
        $start_date = $request->get('start_date');
        $end_date = $request->get('end_date');

        if($start_date == "" && $end_date == "") {
            $end_date = date("Y-m-d", strtotime("+" . 6 . "months"));
            $start_date = date("Y-m-d", strtotime("-" . 2 . "years"));
        } else if($start_date == "") {
            $start_date = date("Y-m-d", strtotime($end_date . " -" . 2 . "years"));
            $end_date = date("Y-m-d", strtotime($end_date));
        } else if($end_date == "") {
            $end_date = date("Y-m-d", strtotime($start_date . " +" . 2 . "years"));
            $start_date = date("Y-m-d", strtotime($start_date));
        } else {
            $end_date = date("Y-m-d", strtotime($end_date));
            $start_date = date("Y-m-d", strtotime($start_date));
        }

        if($show_inactive)
            $members = Member::orderBy('first_name')->get();
        else
            $members = Member::where('active', true)->orderBy('first_name')->get();

        $semesters = Semester::whereBetween('end_date', array($start_date, $end_date))->orderBy('end_date')->get();

        return view('overview.payment', array('members' => $members, 'semesters' => $semesters, 'show_inactive' => $show_inactive,
            'start_date' => $start_date,
            'end_date' => $end_date));
    }

    public function allergies(Request $request) {
        if($request->get('include_inactive')) {
            $members = Member::where('allergies', '!=', '')->orderBy('first_name')->get();
        } else {
            $members = Member::where('allergies', '!=', '')->where('active', true)->orderBy('first_name')->get();
        }

        return view('overview.allergies', array('members' => $members, 'include_inactive' => $request->get('include_inactive')));
    }

    public function mail_list(Request $request) {
        if($request->get('include_inactive')) {
            $members = Member::orderBy('first_name')->get();
        } else {
            $members = Member::where('active', true)->orderBy('first_name')->get();
        }

        return view('overview.maillist', array('members' => $members, 'include_inactive' => $request->get('include_inactive')));
    }

    public function contact_information(Request $request) {
        if($request->get('include_inactive')) {
            $members = Member::orderBy('first_name')->get();
        } else {
            $members = Member::where('active', true)->orderBy('first_name')->get();
        }

        return view('overview.contact', array('members' => $members, 'include_inactive' => $request->get('include_inactive')));
    }

    public function statistics(Request $request) {
        if($request->has('semester')) {
            $chosen_semester = Semester::find($request->semester);
        } else {
            $chosen_semester = Semester::orderBy('end_date', 'desc')->first();
        }

        $semesters = Semester::orderBy('end_date', 'desc')->get();
        $num_practices = Event::where('type', 'Øvelse')
                            ->where('date', '>=', $chosen_semester->start_date)
                            ->where('date', '<=', $chosen_semester->end_date)
                            ->count();
        $avg_attendance = DB::select('
                            SELECT AVG(attendants) as average FROM (
                              SELECT COUNT(*) as attendants
                              FROM events
                              INNER JOIN event_member ON events.id = event_id
                              WHERE date >= ?
                              AND date <= ?
                              GROUP BY events.id
                            );'
                       , [$chosen_semester->start_date, $chosen_semester->end_date])[0]->average;

        $max_attendance = DB::select('
                            SELECT MAX(attendants) as max FROM (
                              SELECT COUNT(*) as attendants
                              FROM events
                              INNER JOIN event_member ON events.id = event_id
                              WHERE date >= ?
                              AND date <= ?
                              GROUP BY events.id
                            );'
            , [$chosen_semester->start_date, $chosen_semester->end_date])[0]->max;

        $min_attendance = DB::select('
                            SELECT MIN(attendants) as min FROM (
                              SELECT COUNT(*) as attendants
                              FROM events
                              INNER JOIN event_member ON events.id = event_id
                              WHERE date >= ?
                              AND date <= ?
                              GROUP BY events.id
                            );'
            , [$chosen_semester->start_date, $chosen_semester->end_date])[0]->min;

        return view('overview.semester_statistics', array(
            'chosen_semester' => $chosen_semester,
            'semesters' => $semesters,
            'num_practices' => $num_practices,
            'avg_attendance' => $avg_attendance,
            'max_attendance' => $max_attendance,
            'min_attendance' => $min_attendance,
        ));
    }

}
