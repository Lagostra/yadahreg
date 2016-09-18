<?php

namespace App\Http\Controllers;

use App\Member;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Validator;

class MemberController extends Controller {

    public function __construct() {
        $this->middleware('auth');
    }

    public function index() {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        $members = Member::orderBy('last_name')->get();

        return view('members.list', array('members' => $members));
    }

    public function add() {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        return view('members.add');
    }

    public function do_add(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }


        $validator = Validator::make($request->all(), [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'email|max:255',
            'phone' => 'numeric',
            'voice' => array('regex:[sopran|alt|tenor|bass]'),
            'active' => array('required', 'regex:[true|false]')
        ]);

        if ($validator->fails()) {
            if($validator)
                return redirect(url('/members/add'))
                    ->withErrors($validator)
                    ->withInput();
        }

        $member = new Member;
        $member->first_name = $request->get('first_name');
        $member->last_name = $request->get('last_name');
        $member->email = $request->get('nullable|email');
        $member->phone = $request->get('nullable|phone');
        $member->preferred_voice = $request->get('preferred_voice');
        $member->active = $this->toBool($request->get('active'));
        $member->save();
        return redirect(url('/members'));

    }

    private function toBool($string) {
        if($string == 'true')
            return true;
        return false;
    }

    public function delete(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }

        Member::where('id', $request->get('id'))->delete();
        return redirect(url('/members'));
    }

    public function edit($id) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }


    }

    public function do_edit(Request $request) {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }


    }

}
