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

        if($event_id == -1)
            $chosen_event = Event::orderBy('date', 'desc')->first();
        else
            $chosen_event = Event::find('id', $event_id);

        return view('registration.index', array('members' => $members, 'chosen_event' => $chosen_event, 'events' => $events));
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


    }

}