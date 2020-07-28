<?php
namespace App\Http\Controllers;

use Alaouy\Youtube\Youtube;

class RewriteYoutube extends Youtube
{
    public function __construct() {
        parent::__construct(config('youtube.key'));
    }
    public function listChannelVideos($channelId, $maxResults = 10, $order = null, $part = ['id', 'snippet'], $pageInfo = false, $pageToken = '')
    {
        $params = [
            'type' => 'video',
            'channelId' => $channelId,
            'part' => implode(',', $part),
            'maxResults' => $maxResults,
            'pageToken' => $pageToken,
        ];
        if (!empty($order)) {
            $params['order'] = $order;
        }

        return $this->searchAdvanced($params, $pageInfo);
    }
}