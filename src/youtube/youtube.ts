import config from "../config.json";
import fetch from 'cross-fetch';

const key = config['creds']['youtube_api_key'];

export const create_youtube_video_url = (id: string) => "https://www.youtube.com/watch?v=" + id;
export const create_youtube_playlist_url = (id: string) => "https://www.youtube.com/playlist?list=" + id;

const fetch_json = async (url: string) => {
    const res = await fetch(url);
    return await res.json();
}

export const youtube_api = {
    PlaylistsItems: async (playlistId: string, pageToken?: string) => {
        let uri: string = `https://www.googleapis.com/youtube/v3/playlistItems?key=${key}&playlistId=${playlistId}&part=snippet&maxResults=50`;
        
        if (pageToken) 
            uri += "&pageToken=" + pageToken;

        return await fetch_json(uri);
    },

    Search: async (keywords: string) => {
        
        return await fetch_json(`https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&q=${keywords}`);
    },

    Videos: async (id: string) => {
        return await fetch_json(`https://www.googleapis.com/youtube/v3/videos?key=${key}&part=snippet&id=${id}`);
    }   
}