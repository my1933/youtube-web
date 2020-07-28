<?php
namespace App\Http\Controllers;

use Alaouy\Youtube\Facades\Youtube;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller{

    /*
         * post channel_list
         * 取得已经提交的播放列表和频道
         *
         * @param string      $token 用户TOKEN
         * return [
         * data => [channel=>[], video_list=>[]]
         * ]
         * */
    public function channelList(Request $request)
    {
        $id = $request->post('id');
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }
        if (!$id) {
            return $this->error('BadRequest');
        }
        $list = Cache::rememberForever('list', function() {
            return json_encode(['list'=> [], 'channel' => []]);
        });
        $list = json_decode($list, true);
        // 播放列表
        if (strlen($id) == 34) {
            $res = Youtube::getPlaylistById($id);
            $res =json_decode(json_encode($res),TRUE);
            if ($res && isset($res['snippet'])) {
                $exist = false;
                if (count($list['list'])) {
                    $id_column = array_column($list['list'], 'id');
                    if (array_search($id, $id_column) !== false) {
                        $exist = true;
                    }
                }
                if (! $exist) {
                    $list['list'][] = [
                        'id' => $id,
                        'title' => $res['snippet']['title'],
                        'thumbnail' => isset($res['snippet']['thumbnails']['medium']['url']) ? $res['snippet']['thumbnails']['medium']['url']: '',
                    ];
                    Cache::forever('list', json_encode($list));
                }
            }
        }
        // 频道列表
        elseif (strlen($id) == 24) {
            $res = Youtube::getChannelById($id);
            $res =json_decode(json_encode($res),TRUE);
            if ($res && isset($res['snippet'])) {
                $exist = false;
                if (count($list['channel'])) {
                    $id_column = array_column($list['channel'], 'id');
                    if (array_search($id, $id_column) !== false) {
                        $exist = true;
                    }
                }
                if (! $exist) {
                    $list['channel'][] = [
                        'id' => $id,
                        'title' => $res['snippet']['title'],
                        'thumbnail' => isset($res['snippet']['thumbnails']['medium']['url']) ? $res['snippet']['thumbnails']['medium']['url']: '',
                    ];
                    Cache::forever('list', json_encode($list));
                }

            }
        }
        return $this->success($list);
    }
}