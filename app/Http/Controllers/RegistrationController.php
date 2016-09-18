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
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller {

    public function __construct() {
        $this->middleware('auth');
    }

    public function index($event_id = -1) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        $members = Member::orderBy('first_name')->get();
        $events = Event::orderBy('date', 'desc')->get();

        $chosen_event = Event::find($event_id);

        if($chosen_event == null) {
            $chosen_event = Event::orderBy('date', 'desc')->first();
        }

        foreach($members as $member) {
            foreach($member->events as $event) {
                if($event->id == $chosen_event->id) {
                    $member->present = true;
                    break;
                }
            }
        }

        return view('registration.index', array('members' => $members, 'chosen_event' => $chosen_event, 'events' => $events));
    }

    public function set_present(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

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
        if($request->get('status')) {
            $member->events()->attach($event);
        } else {
            $member->events()->detach($event);
        }
    }

    public function add_today() {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        $event = new Event();
        $event->date = date('Y-m-d');
        $event->save();

        return redirect(url('/registration/'.$event->id));
    }

    public function add() {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        return view('registration.add');
    }

    public function do_add(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        $validator = Validator::make($request->all(), [
            'date' => 'date|required',
            'title' => 'string|max:50|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
            foreach ($validator->errors()->all() as $error) {
                echo $error;
            }
            return;
        }

        $event = new Event();
        $event->date = date("Y-m-d", strtotime($request->get('date')));
        $event->title = $request->get('title');
        $event->save();

        return redirect(url('/registration/'.$event->id));
    }

    public function edit($id) {
        $event = Event::find($id);

        if($event == null)
            return redirect(url('/registration'));

        return view('registration.edit', array('event' => $event));
    }

    public function do_edit(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        $validator = Validator::make($request->all(), [
            'date' => 'date|required',
            'title' => 'string|max:50|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
            foreach ($validator->errors()->all() as $error) {
                echo $error;
            }
            return;
        }

        $event = Event::find($request->get('id'));
        $event->date = date("Y-m-d", strtotime($request->get('date')));
        $event->title = $request->get('title');
        $event->save();

        return redirect(url('/registration/'.$event->id));
    }

    public function delete(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        $event = Event::find($request->get('id'));
        $event->delete();

        return redirect(url('/registration'));
    }

}