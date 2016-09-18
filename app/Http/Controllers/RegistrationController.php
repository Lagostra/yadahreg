<?php
/**
 * Created by PhpStorm.
 * User: eivind
 * Date: 18/09/2016
 * Time: 09:29
 */

namespace App\Http\Controllers;


use App\Member;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller {

    public function __construct() {
        $this->middleware('auth');
    }

    public function index() {
        if(!(Auth::user()->role == 'admin' || Auth::user()->role == 'user') ) {
            return redirect(url('/home'));
        }


        $members = Member::orderBy('first_name')->get();
        return view('registration.index', array('members' => $members));
    }

}