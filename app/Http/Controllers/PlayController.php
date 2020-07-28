<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use YouTube\YouTubeDownloader;
use YouTube\YoutubeStreamer;
use Alaouy\Youtube\Facades\Youtube;

class  PlayController extends Controller{

    /*
     * GET /play
     * 返回视频或音频流
     *
     * @param string        $token 用户TOKEN
     * @param string        $type enum:[video,audio]
     * @param string        $id 视频ID
     *
     * */

    public function play(Request $request)
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
}