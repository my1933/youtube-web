<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use YouTube\YouTubeDownloader;
use YouTube\YoutubeStreamer;
use Alaouy\Youtube\Facades\Youtube;
use Illuminate\Support\Facades\Cache;


class  VideoController extends Controller{

    /*
     * GET video_list
     * 取得已经提交的播放列表和频道
     *
     * @param string      $token 用户TOKEN
     * return [
     * data => [channel=>[], video_list=>[]]
     * ]
     * */

    public function videoList(Request $request)
    {
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }

        $content = Cache::rememberForever('list', function() {
            return json_encode(['channel' => '', 'list' => '']);
        });
        $list = json_decode($content, true);
        return $this->success($list);
    }

    /*
     * GET videos
     * 视频List
     *
     * @param string      $token 用户TOKEN
     * @param string      $id    播放列表的ID
     * @param string      $type  enum:[channel,list]
     * @param number      $page  页码
     * @param boolean     $sort  排序
     * @param boolean     $refresh 刷新
     * return [
     * data => []
     * ]
     * */

    public function videos(Request $request)
    {
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }
        $id = $request->get('id', '');
        $type = $request->get('type', 'list');
        if (! $id) {
            return $this->error('BidRequest');
        }
        $refresh = $request->get('refresh', false);
        if ($refresh) {
            Cache::forget($id);
        }
        $content = Cache::remember($id, 60 * 12, function() use($id, $type) {
            if ($type == 'list') {
                return json_encode($this->getListVideos($id));
            } else {
                return json_encode($this->getChannelVideos($id));
            }

        });
        $list = json_decode($content, true);
        $page = $request->get('page', 1);
        $sort = $request->get('sort', true);
        if (! $sort) {
            $list = array_reverse($list);
        }
        $limit = 50;
        $total = count($list);
        $count = ceil($total/$limit);
        $skip = ($page - 1) * $limit;
        if (count($list) > $skip) {
            $list = array_slice($list, $skip, $limit);
        } else {
            $list = array_slice($list, 0, $limit);
        }
        $page = [
            'current' => (int)$page,
            'total' => $total,
            'count' => $count,
        ];
        return $this->success(compact('list','page'));

    }
    // 返回播放列表的全部视频信息
    private function getListVideos($id, $token = '')
    {
        $videos = Youtube::getPlaylistItemsByPlaylistId($id, $token, 50);
        $videos = json_decode(json_encode($videos),TRUE);
        $list = [];
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
                $list = array_merge($list, $this->getListVideos($id, $videos['info']['nextPageToken']));
            }
        }
        return $list;
    }

    // 返回播放频道的全部视频信息，最多500条
    private function getChannelVideos($id, $token = '') {
        //'UCa6ERCDt3GzkvLye32ar89w'$playlistId, $pageToken = '', $maxResults = 50
        $videos = (new RewriteYoutube)->listChannelVideos($id, 50, 'date', ['id', 'snippet'], true, $token);
        $videos = json_decode(json_encode($videos),TRUE);
        $list = [];
        if (! (is_array($videos) && isset($videos['results']) && is_array($videos['results']))) {
            return $list;
        }
        if (count($videos) && isset($videos['results']) && count($videos['results'])) {
            foreach ($videos['results'] as $video) {
                if ($video['snippet']['title'] == 'Private video') {
                    continue;
                }
                if (isset($video['snippet']['publishTime'])) {
                    $created_at = date('Y-m-d H:i:s', strtotime($video['snippet']['publishTime']));
                } else {
                    $created_at = date('Y-m-d H:i:s');
                }
                $list[] = [
                    'title' => $video['snippet']['title'],
                    'thumbnail' => isset($video['snippet']['thumbnails']['medium']['url']) ? $video['snippet']['thumbnails']['medium']['url'] : '',
                    'id' => $video['id']['videoId'],
                    'created_at' => $created_at
                ];
            }
            if ($videos['info']['nextPageToken'] && count($list) < $videos['info']['totalResults']) {
                $list = array_merge($list, $this->getChannelVideos($id, $videos['info']['nextPageToken']));
            }
        }
        return $list;
    }
}