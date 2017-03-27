<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MemberAddFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('members', function($table) {
            $table->date('birthday')->nullable();
            $table->string('address')->nullable();
            $table->string('allergies')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('members', function($table) {
            $table->dropColumn('birthday');
        });
		Schema::table('members', function($table) {
            $table->dropColumn('address');
        });
		Schema::table('members', function($table) {
            $table->dropColumn('allergies');
        });
    }
}
