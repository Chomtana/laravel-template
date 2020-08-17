<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('store', function (Blueprint $table) {
      $table->increments('id');
      $table->string('name');
$table->text('cover_img');
$table->float('lat',53)->nullable();
$table->float('lng',53)->nullable();
$table->json('open_data');
$table->integer('owner_id')->nullable()->unsigned()->index();
$table->json('owner_data');
$table->integer('market_id')->nullable()->unsigned()->index();
$table->json('market_data');
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
    Schema::dropIfExists('store');
  }

}
