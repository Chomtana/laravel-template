<?php
namespace App\Models\User;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\User;

trait UserAutofill {

  public function onRead(User &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, User &$currdata) {

  }

  public function afterCreate(User &$data) {

  }

  public function beforeUpdate(array &$data, User &$olddata) {

  }

  public function updateAutofill(array &$data, User &$currdata) {

  }

  public function afterUpdate(User &$data) {

  }

  public function beforeDelete(User &$data) {

  }

  public function afterDelete($id) {

  }

}
