<?php

use Illuminate\Http\Request;

Route::get('play', 'VideoController@index');
Route::get('video_list', 'VideoController@videoList');
Route::get('videos', 'VideoController@videos');
Route::get('images', 'VideoController@images');
Route::post('token', 'UserController@token');
Route::post('admin/video_list', 'AdminController@videoList');
Route::post('list_update', 'AdminController@listUpdate');
