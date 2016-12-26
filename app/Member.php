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

    public function is_present(Event $event) {
        return $this->events->contains($event);
    }

    public function is_not_present(Event $event) {
        return $this->not_present_events->contains($event);
    }

    public function has_paid(Semester $semester) {
        return $this->paid_semesters->contains($semester);
    }

}
