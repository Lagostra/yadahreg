<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class SemesterController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function add() {
        return view('semesters.add');
    }

    public function do_add() {

    }

    public function edit() {
        return view('semesters.edit');
    }

    public function do_edit() {

    }

    public function delete() {

    }

}
