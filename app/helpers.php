<?php

use \App\Models\Chomtana\Stock;
use App\Models\Chomtana\RequisitionItem;
use App\Repositories\Chomtana\StockRepository;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
|
| Here is where you can register global helper functions for your application.
| These functions are automatically loaded by composer. Whenever you update
| this file, you need to run 'composer dump-autoload'.
|
*/

if (! function_exists('escapeLike')) {
    function escapeLike($str) {
        return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $str);
    }
}

if (! function_exists('includeRouteFiles')) {

    /**
     * Recursively include/require all PHP files in the given folder
     *
     * @param string  $folder
     */
    function includeRouteFiles($folder)
    {
        $directory = $folder;
        $handle = opendir($directory);
        $directory_list = [$directory];

        while (false !== ($filename = readdir($handle))) {
            if ($filename != '.' && $filename != '..' && is_dir($directory.$filename)) {
                array_push($directory_list, $directory.$filename.'/');
            }
        }

        foreach ($directory_list as $directory) {
            foreach (glob($directory.'*.php') as $filename) {
                require $filename;
            }
        }
    }
}

if (! function_exists('includeRouteFilesShallow')) {

    /**
     * Include/require all PHP files in the given folder
     *
     * @param string  $folder
     */
    function includeRouteFilesShallow($folder)
    {
        $directory = $folder;
        $handle = opendir($directory);
        $directory_list = [$directory];

        /*while (false !== ($filename = readdir($handle))) {
            if ($filename != '.' && $filename != '..' && is_dir($directory.$filename)) {
                array_push($directory_list, $directory.$filename.'/');
            }
        }*/

        foreach ($directory_list as $directory) {
            foreach (glob($directory.'*.php') as $filename) {
                require $filename;
            }
        }
    }
}

if (! function_exists('array_unique_id')) {

    /**
     * Return an identifier that guarantee to be unique within
     * the input array, identified by the given column_key.
     * If the column_key is not specified, we will use 'id' as the default.
     *
     * For example, you might want to insert an item into an array but want to make sure
     * that the item's id is unique.
     *
     * $fruits = [
     *    [ 'id' => '1', 'name' => 'apple' ],
     *    [ 'id' => '2', 'name' => 'banana']
     * ];
     *
     * $fruits[] = $orange = [ 'id' => array_unique_id($fruits), 'name' => 'orange' ];
     *
     * @param  array   $array
     * @param  string  $column_key
     * @return string
     */
    function array_unique_id($array, $column_key = 'id')
    {
        // Get the values from a single column in the input array.
        $values = array_column($array, $column_key);

        // Repeatedly generate a new identifier until we found a unique value.
        do { } while (in_array($id = uniqid(), $values));

        return $id;
    }
}

if (! function_exists('array_filter_recusive')) {

    /**
     * Recursively filters elements of an array using a callback function
     *
     * @param  array     $array
     * @param  callable  $callback
     * @return array
     */
    function array_filter_recursive($input, $callback = null)
    {
        foreach ($input as &$value)
        {
            if (is_array($value))
            {
                $value = array_filter_recursive($value, $callback);
            }
        }

        return array_filter($input, $callback);
    }
}

if (! function_exists('array_convert_null_to_empty_string')) {

    /**
     * Recursively convert every member of the input array with a null value
     * to an empty string, and return an array.
     *
     * @param  array  $array
     * @return array
     */
    function array_convert_null_to_empty_string($array)
    {
        array_walk_recursive($array, function (&$item, $key) {
            $item = is_null($item) ? '' : $item;
        });

        return $array;
    }
}
