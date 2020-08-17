<?php
namespace App\Models\Chomtana;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\FailedJobs\FailedJobsPermission;
use App\Models\FailedJobs\FailedJobsAutofill;



class FailedJobs extends Model {

  
    use FailedJobsPermission;
    use FailedJobsAutofill;


  protected $table = 'failed_jobs';

  

  /**
   * all columns of this table
   *
   */
  public $allColumns = ["connection","queue","payload","exception","failed_at","edit_histories"];

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ["connection","queue","payload","exception","failed_at"];

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
    'failed_at' => 'datetime'
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
    return $this->hasOne('App\Models\Chomtana\FailedJobs',"id","id");
  }

  public function view() {
    return $this->hasOne('App\Models\Chomtana\FailedJobs',"id","id");
  }

  public function refresh() {
    return FailedJobs::find($this->id);
  }

  
  public function revisions()
  {
    
      return $this->view->morphMany('App\Models\Chomtana\Revisions', 'failed_jobs', 'reference_type', 'reference_id');
    
  }



  

}
