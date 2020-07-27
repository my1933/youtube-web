<?php
namespace App\Http\Controllers;

use Alaouy\Youtube\Facades\Youtube;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use mysql_xdevapi\Exception;

class AdminController extends Controller{


    public function videoList(Request $request)
    {
        $id = $request->post('id');
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }
        if (!$id) {
            return $this->error('BadRequest');
        }
        $lists = Youtube::getPlaylistById($id);
        $lists =json_decode(json_encode($lists),TRUE);
        if ($lists && isset($lists['snippet'])) {
            if (Storage::exists('public/videoList.json')) {
                $content = Storage::get('public/videoList.json');
                $list = json_decode($content, true);
            } else {
                $list = [];
            }
            $id_column = array_column($list, 'id');
            if (array_search($id, $id_column) === false) {
                $list[] = [
                    'id' => $id,
                    'channelId' => $lists['snippet']['channelId'],
                    'title' => $lists['snippet']['title'],
                    'thumbnail' => isset($lists['snippet']['thumbnails']['medium']['url']) ? $lists['snippet']['thumbnails']['medium']['url']: '',
                ];
                Storage::put('public/videoList.json', json_encode($list));
            }
            $video_list = $this->listVideos($id);
            $this->writeVideos($id, $video_list );
            return $this->success();
        }
        return $this->error('Request ID is Error');
    }

    public function listUpdate(Request $request)
    {
        $id = $request->post('id');
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }
        if (!$id) {
            return $this->error('BadRequest');
        }

        $lists = Youtube::getPlaylistById($id);
        $lists =json_decode(json_encode($lists),TRUE);
        if ($lists && isset($lists['snippet'])) {
            if (Storage::exists('public/videoList.json')) {
                $content = Storage::get('public/videoList.json');
                $list = json_decode($content, true);
            } else {
                $list = [];
            }
            $id_column = array_column($list, 'id');
            if (array_search($id, $id_column) === false) {
                $list[] = [
                    'id' => $id,
                    'channelId' => $lists['snippet']['channelId'],
                    'title' => $lists['snippet']['title'],
                    'thumbnail' => isset($lists['snippet']['thumbnails']['medium']['url']) ? $lists['snippet']['thumbnails']['medium']['url']: '',
                    ];
                Storage::put('public/videoList.json', json_encode($list));
            }
            $video_list = $this->listVideos($id);
            $this->writeVideos($id, $video_list );
            return $this->success();
        }
        return $this->error('Request ID is Error');
    }

    public function listVideos($id, $token= '')
    {
        $videos = Youtube::getPlaylistItemsByPlaylistId($id, $token);
        $videos = json_decode(json_encode($videos),TRUE);
        if (count($videos) && isset($videos['results']) && count($videos['results'])) {
            foreach ($videos['results'] as $video) {
                if ($video['snippet']['title'] == 'Private video') {
                    continue;
                }
                if (isset($video['contentDetails']['videoPublishedAt'])) {
                    $created_at = date('Y-m-d H:i:s', strtotime($video['contentDetails']['videoPublishedAt']));
                } else {
                    $created_at = date('Y-m-d H:i:s');
                }

                $list[] = [
                    'title' => $video['snippet']['title'],
                    'thumbnail' => isset($video['snippet']['thumbnails']['medium']['url']) ? $video['snippet']['thumbnails']['medium']['url'] : '',
                    'id' => $video['contentDetails']['videoId'],
                    'created_at' => $created_at
                ];
            }
            if ($videos['info']['nextPageToken'] && count($list) < $videos['info']['totalResults']) {
                $list = array_merge($list, $this->listVideos($id, $videos['info']['nextPageToken']));
            }
        }
        return $list;
    }

    public function writeVideos($id, $list)
    {
        $name = str_replace('-','_', $id);
        Storage::put("public/{$name}.json", json_encode($list));
        return true;
    }
}