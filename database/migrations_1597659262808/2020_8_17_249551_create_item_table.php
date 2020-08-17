<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('item', function (Blueprint $table) {
      $table->increments('id');
      $table->string('name');
$table->text('cover_img');
$table->json('price_data');
$table->integer('store_id')->nullable()->unsigned()->index();
$table->json('store_data');
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
    Schema::dropIfExists('item');
  }

}
