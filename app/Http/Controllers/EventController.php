<?php
/**
 * Created by PhpStorm.
 * User: eivind
 * Date: 20/09/2016
 * Time: 08:55
 */

namespace App\Http\Controllers;

use App\Event;
use App\Member;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function add_today() {
        $event = new Event();
        $event->date = date('Y-m-d');
        $event->save();

        return redirect(url('/registration/'.$event->id));
    }

    public function add() {
        return view('events.add');
    }

    public function do_add(Request $request) {
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

        return view('events.edit', array('event' => $event));
    }

    public function do_edit(Request $request) {
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
        $event = Event::find($request->get('id'));
        $event->delete();

        return redirect(url('/registration'));
    }
}