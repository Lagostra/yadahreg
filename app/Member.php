<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model{

    public function events() {
        return $this->belongsToMany('App\Event');
    }

    public function not_present_events() {
        return $this->belongsToMany('App\Event', 'confirmed_not_present');
    }

    public function paid_semesters() {
        return $this->belongsToMany('App\Semester');
    }

}
