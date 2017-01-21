<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DateTime;

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

    /*
     *  Helper functions
     */
    public function get_age() {
        return (new DateTime($this->birthday))
            ->diff(new DateTime('now'))
            ->y;
    }

    public function is_present(Event $event = null) {
        if($event == null)
            return false;
        return $this->events->contains($event);
    }

    public function is_not_present(Event $event = null) {
        if($event == null)
            return false;
        return $this->not_present_events->contains($event);
    }

    public function has_paid(Semester $semester = null) {
        if($semester == null)
            return false;
        return $this->paid_semesters->contains($semester);
    }

}
