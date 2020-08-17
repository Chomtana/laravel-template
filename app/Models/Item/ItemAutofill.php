<?php
namespace App\Models\Item;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Item;

trait ItemAutofill {

  public function onRead(Item &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, Item &$currdata) {

  }

  public function afterCreate(Item &$data) {

  }

  public function beforeUpdate(array &$data, Item &$olddata) {

  }

  public function updateAutofill(array &$data, Item &$currdata) {

  }

  public function afterUpdate(Item &$data) {

  }

  public function beforeDelete(Item &$data) {

  }

  public function afterDelete($id) {

  }

}
