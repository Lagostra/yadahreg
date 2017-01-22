<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use App\Member;
use App\Event;
use App\Card;

class ApiController extends Controller {

    public function __construct() {
        $this->middleware('auth:api');
    }

    public function get_events() {
        if(!Auth::user()->is_user())
            return redirect(url('/home'));

        return Event::orderBy('date', 'desc')->select('id', 'title', 'date')->get()->toJson();
    }

    public function get_members(Request $request) {
        if(!Auth::user()->is_user())
            return redirect(url('/home'));

        $include_inactive = $request->get('include_inactive');

        if(!$include_inactive)
            $members = Member::where('active', !$include_inactive)
                                ->select('first_name', 'last_name', 'id')
                                ->orderBy('last_name')
                                ->get();
        else
            $members = Member::
                select('first_name', 'last_name', 'id')
                ->orderBy('last_name')
                ->get();

        return $members->toJson();
    }

    /**
     *  Sets member present based on provided card mifare.
     *  Returns name of member if successful.
     */
    public function set_present_by_card(Request $request) {
        if(!Auth::user()->is_user())
            return redirect(url('/home'));

        $card = $request->get('card');
        $event_id = $request->get('event_id');

        if(!$card || $event_id)
            http_response_code(400);
            return "Incorrectly formatted data.";


        $card = Card::where('mifare', $card)->first();
        if($card == null)
            return "Card is not registered to any members";
        $member = $card->owner();

        $event = Event::find($event_id);

        $member->events()->attach($event);

        return $member->first_name + " " + $member->last_name;
    }

    /**
     *  Registers a card to a member.
     *  Returns member id if successful.
     */
    public function register_card(Request $request) {
        if(!Auth::user()->is_user())
            return redirect(url('/home'));

        $mifare = $request->get('card');
        if(!$mifare) {
            http_response_code(400);
            return 'No card number given';
        }

        $card = Card::where('mifare', $mifare)->first();
        if($card) {
            http_response_code(400);
            return 'Card already registered';
        }
        $member = Member::find($request->get('member_id'));
        if(!$member) {
            http_response_code(400);
            return 'Member not found';
        }

        $card = new Card;
        $card->mifare = $mifare;
        $card->owner()->associate($member);
        $card->save();
        return $member->id;
    }

}
