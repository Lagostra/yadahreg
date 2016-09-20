<?php

namespace App\Http\Controllers;

use App\Member;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Validator;

class MemberController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function index($show_inactive = 0) {
        if(!$show_inactive)
            $members = Member::where('active', true)->orderBy('last_name')->get();
        else
            $members = Member::orderBy('last_name')->get();

        return view('members.list', array('members' => $members, 'show_inactive' => $show_inactive));
    }

    public function add() {
        return view('members.add');
    }

    public function do_add(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'email|max:255',
            'phone' => 'numeric',
            'voice' => array('regex:[sopran|alt|tenor|bass]'),
            'active' => array('required', 'regex:[true|false]'),
            'birthday' => 'date|nullable',
            'address' => 'nullable',
            'allergies' => 'nullable',
        ]);

        if ($validator->fails()) {
            if($validator)
                return redirect(url('/members/add'))
                    ->withErrors($validator)
                    ->withInput();
        }

        $phone = $request->get('phone');
        if($phone == "")
            $phone = null;

        $member = new Member;
        $member->first_name = $request->get('first_name');
        $member->last_name = $request->get('last_name');
        $member->email = $request->get('email');
        $member->phone = $phone;
        $member->preferred_voice = $request->get('preferred_voice');
        $member->active = $this->toBool($request->get('active'));
        $member->birthday = date("Y-m-d", strtotime($request->get('birthday')));
        $member->address = $request->get('address');
        $member->allergies = $request->get('allergies');
        $member->save();
        return redirect(url('/members'));
    }

    private function toBool($string) {
        if($string == 'true')
            return true;
        return false;
    }

    public function delete(Request $request) {
        Member::where('id', $request->get('id'))->delete();
        return redirect(url('/members'));
    }

    public function edit($id) {
        $member = Member::find($id);
        if($member == null) {
            return redirect(url('/members'));
        }
        return view('members.edit', array('member' => $member));
    }

    public function do_edit(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|numeric',
            'voice' => array('nullable','regex:[sopran|alt|tenor|bass]'),
            'active' => array('required', 'regex:[true|false]'),
            'birthday' => 'date|nullable',
            'address' => 'nullable',
            'allergies' => 'nullable',
        ]);

        if ($validator->fails()) {
            if($validator)
                return redirect(url('/members/add'))
                    ->withErrors($validator)
                    ->withInput();
        }

        $phone = $request->get('phone');
        if($phone == "")
            $phone = null;

        $member = Member::find($request->id);
        if($member == null)
            return redirect(url('/members'));

        $member->first_name = $request->get('first_name');
        $member->last_name = $request->get('last_name');
        $member->email = $request->get('email');
        $member->phone = $phone;
        $member->preferred_voice = $request->get('preferred_voice');
        $member->active = $this->toBool($request->get('active'));
        $member->birthday = date("Y-m-d", strtotime($request->get('birthday')));
        $member->address = $request->get('address');
        $member->allergies = $request->get('allergies');
        $member->save();
        return redirect(url('/members'));
    }

}
