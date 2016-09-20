<?php

namespace App\Http\Controllers;

use App\Event;
use App\Member;
use Illuminate\Http\Request;

use App\Http\Requests;

class OverviewController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function list_events(Request $request, $show_inactive = 0) {
        $start_date = date("Y-m-d", strtotime($request->get('start_date')));
        $end_date = date("Y-m-d", strtotime($request->get('end_date')));

        if($show_inactive)
            $members = Member::orderBy('first_name')->get();
        else
            $members = Member::where('active', true)->orderBy('first_name')->get();

        $events = Event::whereBetween('date', array($start_date, $end_date))->orderBy('date')->get();

        return view('overview.events', array('members' => $members, 'events' => $events,
                                        'start_date' => $request->get('start_date'),
                                        'end_date' => $request->get('end_date')));
    }

}
