<?php
/**
 * Created by PhpStorm.
 * User: eivind
 * Date: 18/09/2016
 * Time: 09:29
 */

namespace App\Http\Controllers;


use App\Event;
use App\Member;
use App\Semester;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function index($event_id = -1) {
        $members = Member::where('active', true)->orderBy('first_name', 'ASC')->get();
        $events = Event::orderBy('date', 'desc')->get();

        $birthdays = Member::where('active', true)
                                ->whereMonth('birthday', '=', date('n'))
                                ->whereDay('birthday', '=', date('d'))
                                ->orderBy('first_name', 'ASC')->get();

        $chosen_event = Event::find($event_id);

        if($chosen_event == null) {
            $chosen_event = Event::orderBy('date', 'desc')->first();
        }

        $last_semester = Semester::orderBy('end_date', 'desc')->first();

        return view('registration.index', array('members' => $members, 'birthdays' => $birthdays,
                                                'chosen_event' => $chosen_event, 'events' => $events,
                                                'last_semester' => $last_semester));
    }

    public function set_present(Request $request) {
        $validator = Validator::make($request->all(), [
            'member_id' => 'numeric|required',
            'event_id' => 'numeric|required',
            'status' => 'boolean|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
                foreach ($validator->errors()->all() as $error) {
                    echo $error;
                }
                return;
        }

        $member = Member::find($request->get('member_id'));
        $event = Event::find($request->get('event_id'));
        if($request->get('status') && !$member->events->contains($event)) {
            $member->events()->attach($event);
        } else {
            $member->events()->detach($event);
        }
    }

    public function set_unpresent(Request $request) {
        $validator = Validator::make($request->all(), [
            'member_id' => 'numeric|required',
            'event_id' => 'numeric|required',
            'status' => 'boolean|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
            foreach ($validator->errors()->all() as $error) {
                echo $error;
            }
            return;
        }

        $member = Member::find($request->get('member_id'));
        $event = Event::find($request->get('event_id'));
        if($request->get('status') && !$member->not_present_events->contains($event)) {
            $member->events()->detach($event);
            $member->not_present_events()->attach($event);
        } else {
            $member->not_present_events()->detach($event);
        }
    }
}