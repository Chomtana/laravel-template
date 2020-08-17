<?php
namespace App\Models\Market;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Market;

trait MarketAutofill {

  public function onRead(Market &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, Market &$currdata) {

  }

  public function afterCreate(Market &$data) {

  }

  public function beforeUpdate(array &$data, Market &$olddata) {

  }

  public function updateAutofill(array &$data, Market &$currdata) {

  }

  public function afterUpdate(Market &$data) {

  }

  public function beforeDelete(Market &$data) {

  }

  public function afterDelete($id) {

  }

}
