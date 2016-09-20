<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model {

    public function paid_members() {
        return $this->belongsToMany('App\Member');
    }

}
