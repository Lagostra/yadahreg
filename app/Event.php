<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model {

    public function participants() {
        return $this->belongsToMany('App\Member');
    }

    public function confirmed_not_present() {
        return $this->belongsToMany('App\Member', 'confirmed_not_present');
    }

}
