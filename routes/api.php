<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
 * API Routes
 * All route names in this group are prefixed with 'api.'.
 */
Route::group(['namespace' => 'Api', 'as' => 'api.'], function () {
  includeRouteFiles(__DIR__.'/api/');
});
