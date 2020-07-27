<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\Types\Compound;
use YouTube\YouTubeDownloader;
use YouTube\YoutubeStreamer;

class VideoController extends Controller{
    public function index(Request $request)
    {
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }

        $type = $request->get('type', 'video');

        $video_id = $request->get('id');
        $yt = new YouTubeDownloader();
        $links = $yt->getDownloadLinks("https://www.youtube.com/watch?v={$video_id}");
        $url = '';
        if ($type == 'video') {
            $format = ['mp4', 'video', 'audio'];
            $pix = ['144p', '240p', '360p', '480p'];
            foreach ($pix as $p) {
                foreach($links as $k=> $v){
                    $v_format = explode(',', $v['format']);
                    $v_format = array_map(function($value){return trim($value);}, $v_format);
                    $diff = array_diff(array_merge($format, [$p]), $v_format);
                    if (!count($diff)) {
                        $url = $v['url'];
                    }
                }
                if ($url) {
                    break;
                }
            }
        } else {
            $format = ['m4a', 'audio'];
            foreach($links as $k=> $v){
                $v_format = explode(',', $v['format']);
                $v_format = array_map(function($value){return trim($value);}, $v_format);
                $diff = array_diff($format, $v_format);
                if (!count($diff)) {
                    $url = $v['url'];
                }
            }
        }

        if (! $url) {
            return $this->error('BadRequest');
        }
        $youtube = new YoutubeStreamer();
        $youtube->stream($url);
    }

    public function videoList(Request $request)
    {
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }
        $content = Storage::get('public/videoList.json');
        $list = json_decode($content, true);
        return $this->success($list);
    }

    public function videos(Request $request)
    {
        if (!$this->isToken($request)) {
            return $this->error('BidToken');
        }
        $id = $request->get('id', '');
        $name = str_replace('-','_', $id);
        $list = [];
        if (Storage::exists("public/{$name}.json")) {
            $content = Storage::get("public/{$name}.json");
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
        return $this->success(compact('list'));
    }

    public function images (Request $request) {
        $img = file_get_contents($request->get('url'), true);
        header("Content-Type: image/jpeg;text/html; charset=utf-8");
        echo $img;
    }
}