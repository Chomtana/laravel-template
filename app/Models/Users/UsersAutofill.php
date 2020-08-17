<?php
namespace App\Models\Users;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Users;

trait UsersAutofill {

  public function onRead(Users &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, Users &$currdata) {

  }

  public function afterCreate(Users &$data) {

  }

  public function beforeUpdate(array &$data, Users &$olddata) {

  }

  public function updateAutofill(array &$data, Users &$currdata) {

  }

  public function afterUpdate(Users &$data) {

  }

  public function beforeDelete(Users &$data) {

  }

  public function afterDelete($id) {

  }

}
