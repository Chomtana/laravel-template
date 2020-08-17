<?php
namespace App\Models\Chomtana;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\PasswordResets\PasswordResetsPermission;
use App\Models\PasswordResets\PasswordResetsAutofill;



class PasswordResets extends Model {

  
    use PasswordResetsPermission;
    use PasswordResetsAutofill;


  protected $table = 'password_resets';

  

  /**
   * all columns of this table
   *
   */
  public $allColumns = ["email","token","edit_histories"];

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ["email","token"];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [
    'edit_histories' => 'object',
    
  ];

  /**
   * default value of each column (only if value of that column is null)
   *
   * @var array
   */
  protected $attributes = [
    'edit_histories' => '[]'
  ];

  /**
   * The relations to eager load on every query.
   *
   * @var array
   */
  //protected $with = [];


  /**
   * The relationship counts that should be eager loaded on every query.
   *
   * @var array
   */
  protected $withCount = [];

  

  public $is_view = false;

  public function nonview() {
    return $this->hasOne('App\Models\Chomtana\PasswordResets',"id","id");
  }

  public function view() {
    return $this->hasOne('App\Models\Chomtana\PasswordResets',"id","id");
  }

  public function refresh() {
    return PasswordResets::find($this->id);
  }

  
  public function revisions()
  {
    
      return $this->view->morphMany('App\Models\Chomtana\Revisions', 'password_resets', 'reference_type', 'reference_id');
    
  }



  

}
