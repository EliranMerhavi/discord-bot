import { Message } from "discord.js";
import { Session } from "../Session/Session";
import { Player } from "../Player/Player";
import { youtube_api } from "../youtube/youtube";
import { Resource, VideoResource } from "../Player/Resource";


async function get_random_steavin_video_resource(): Promise<Resource> {
    const steavin_playlistId: string = 'PLSY-acYEmU9bTrn6VDEjAAjveok9871k-';

    let data: any = youtube_api.PlaylistsItems(steavin_playlistId);

    const video_data_resources: string[] = data['items'];

    while (data['nextPageToken']) {
        data = await youtube_api.PlaylistsItems(steavin_playlistId, data['nextPageToken']);
        video_data_resources.push(...data['items']);
    }

    return new VideoResource(video_data_resources[Math.floor(Math.random() * video_data_resources.length)]);
}


const word = async (session: Session, message: Message, args: string) => {
    const player: Player = session.player;

    const user_channel = message.member?.voice.channel;

    if (!user_channel) {
        return "you need to be in a channel stoopid";
    }
    
    if (user_channel !== player.channel) {
        player.connect_to_channel(user_channel);
    }

    const resource: Resource = await get_random_steavin_video_resource();
    player.insert_to_start(resource);
    return `add to the queue\n${resource.info}`;
}

const word_help: string = "word plays a video that teaches how to use a random word";

export {word, word_help};