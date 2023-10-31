import { create_youtube_playlist_url, create_youtube_video_url, youtube_api } from "../youtube/youtube";

export type ResourceData = any;

export enum ResourceType {
    PLAYLIST,
    VIDEO
}

export abstract class Resource {

    protected _url_to_play: string;
    public readonly type: ResourceType
    
    constructor(type: ResourceType, id: string) {
        this.type = type;
        this._url_to_play = create_youtube_video_url(id);
    }

    public abstract finished(): boolean;
    public abstract update(): void;
    public abstract get info(): string;

    public get url_to_play(): string {
        return this._url_to_play;
    }
}

export class PlaylistResource extends Resource {

    private playlist_id: string
    private current_song_index: number
    private current_data_page: any

    constructor(data: ResourceData) {
        super(ResourceType.PLAYLIST, data['items'][0]['snippet']['resourceId']['videoId']);
        this.playlist_id = data['items'][0]['snippet']['playlistId'];
        this.current_song_index = 1;
        this.current_data_page = data;
    }

    public finished(): boolean {
        return (this.current_data_page === this.current_data_page['items'].length) &&
            (this.current_data_page['nextPageToken'] == undefined);
    }

    async update(): Promise<void> {
        if (this.finished())
            throw new Error("the resource is finished");

        if (this.current_song_index === this.current_data_page['items'].length) {
            this.current_data_page = await youtube_api.PlaylistsItems(this.playlist_id, this.current_data_page['nextPageToken']);
            this.current_song_index = 0;
        }
        else
            this.current_song_index++;

        this._url_to_play = create_youtube_video_url(this.current_data_page['items'][this.current_song_index]['snippet']['resourceId']['videoId']);
    }

    public get info(): string {
        return `playlist: <${create_youtube_playlist_url(this.playlist_id)}>\ncurrent video: <${this.url_to_play}>`;
    }
}

export class VideoResource extends Resource {

    constructor(videoId: string) {
        super(ResourceType.VIDEO, videoId);
    }

    public finished(): boolean {
        return true;
    }

    public update(): void {
        throw new Error("SingleResource cannot be updated");
    }

    public get info(): string {
        return `video: <${this.url_to_play}>`;
    }
}

