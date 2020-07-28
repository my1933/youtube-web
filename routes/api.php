<?php

use Illuminate\Http\Request;

Route::get('play', 'PlayController@play');


Route::get('video_list', 'VideoController@videoList');
Route::get('videos', 'VideoController@videos');
Route::get('play', 'PlayController@play');

Route::post('token', 'UserController@token');

Route::post('admin/channel_list', 'AdminController@channelList');

