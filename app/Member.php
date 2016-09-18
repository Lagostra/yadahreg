<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model{

    public function events() {
        return $this->belongsToMany('App\Event');
    }

}
