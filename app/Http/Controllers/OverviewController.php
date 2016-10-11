<?php

namespace App\Http\Controllers;

use App\Event;
use App\Member;
use App\Semester;
use Illuminate\Http\Request;

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
            $start_date = date("Y-m-d", strtotime("-" . 8 * 7 . "days")); // Date 8 weeks before today
        } else if($start_date == "") {
            $start_date = date("Y-m-d", strtotime($end_date . " -" . 8 * 7 . "days")); // Date 8 weeks before end
            $end_date = date("Y-m-d", strtotime($end_date));
        } else if($end_date == "") {
            $end_date = date("Y-m-d", strtotime($start_date . " +" . 8 * 7 . "days")); // Date 8 weeks after start
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
                if($member->events->contains($event)) {
                    break;
                } else {
                    if($member->not_present_events->contains($event)) {
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

}
