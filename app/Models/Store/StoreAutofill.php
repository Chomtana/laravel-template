<?php
namespace App\Models\Store;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Store;

trait StoreAutofill {

  public function onRead(Store &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, Store &$currdata) {

  }

  public function afterCreate(Store &$data) {

  }

  public function beforeUpdate(array &$data, Store &$olddata) {

  }

  public function updateAutofill(array &$data, Store &$currdata) {

  }

  public function afterUpdate(Store &$data) {

  }

  public function beforeDelete(Store &$data) {

  }

  public function afterDelete($id) {

  }

}
