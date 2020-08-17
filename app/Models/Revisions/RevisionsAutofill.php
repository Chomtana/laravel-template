<?php
namespace App\Models\Revisions;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Revisions;

trait RevisionsAutofill {

  public function onRead(Revisions &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, Revisions &$currdata) {

  }

  public function afterCreate(Revisions &$data) {

  }

  public function beforeUpdate(array &$data, Revisions &$olddata) {

  }

  public function updateAutofill(array &$data, Revisions &$currdata) {

  }

  public function afterUpdate(Revisions &$data) {

  }

  public function beforeDelete(Revisions &$data) {

  }

  public function afterDelete($id) {

  }

}
