<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimestampsToConnEntities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('member_semester', function (Blueprint $table) {
            $table->timestamps();
        });
		Schema::table('event_member', function (Blueprint $table) {
            $table->timestamps();
        });
		Schema::table('confirmed_not_present', function (Blueprint $table) {
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('member_semester', function($table) {
            $table->dropColumn('created_at');
        });
		Schema::table('member_semester', function($table) {
			$table->dropColumn('updated_at');
        });
		Schema::table('event_member', function($table) {
            $table->dropColumn('created_at');
        });
		Schema::table('event_member', function($table) {
			$table->dropColumn('updated_at');
        });
		Schema::table('confirmed_not_present', function($table) {
            $table->dropColumn('created_at');
        });
		Schema::table('confirmed_not_present', function($table) {
			$table->dropColumn('updated_at');
        });
    }
}
