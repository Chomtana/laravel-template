<?php
namespace App\Models\Chomtana;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Users\UsersPermission;
use App\Models\Users\UsersAutofill;



class Users extends Authenticatable {

  
    use UsersPermission;
    use UsersAutofill;


  protected $table = 'users';

  

  /**
   * all columns of this table
   *
   */
  public $allColumns = ["username","email","email_verified_at","mobile_number","mobile_verified_at","password","remember_token","profile","settings","is_admin","api_token","otp_id","edit_histories"];

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ["username","email","email_verified_at","mobile_number","mobile_verified_at","password","remember_token","profile","settings","is_admin","otp_id"];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = ["password","remember_token"];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [
    'profile' => 'object',
'settings' => 'object',
'edit_histories' => 'object',
    'email_verified_at' => 'datetime',
'mobile_verified_at' => 'datetime'
  ];

  /**
   * default value of each column (only if value of that column is null)
   *
   * @var array
   */
  protected $attributes = [
    'profile' => '{}',
'settings' => '{}',
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
    return $this->hasOne('App\Models\Chomtana\Users',"id","id");
  }

  public function view() {
    return $this->hasOne('App\Models\Chomtana\Users',"id","id");
  }

  public function refresh() {
    return Users::find($this->id);
  }

  
  public function revisions()
  {
    
      return $this->view->morphMany('App\Models\Chomtana\Revisions', 'users', 'reference_type', 'reference_id');
    
  }



  
        public function otp()
        {
          return $this->belongsTo('App\Models\Chomtana\Otp','otp_id');
        }
      


}
