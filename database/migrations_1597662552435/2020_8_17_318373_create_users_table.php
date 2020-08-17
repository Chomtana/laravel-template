<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('name');
$table->string('email')->unique();
$table->timestamp('email_verified_at')->nullable();
$table->string('mobile_number')->unique();
$table->timestamp('mobile_verified_at')->nullable();
$table->string('password');
$table->string('remember_token')->nullable();
$table->json('profile');
$table->json('settings');
$table->boolean('is_admin')->default(false);
$table->string('api_token',80)->nullable()->unique();
$table->bigint('otp_id')->unsigned()->index();
$table->json('edit_histories')->nullable();
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
    Schema::dropIfExists('users');
  }

}
