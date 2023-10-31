import { Session } from "../Session/Session";
import { Message } from "discord.js";
import { youtube_api } from "../youtube/youtube";
import { PlaylistResource, Resource, ResourceData, VideoResource } from "../Player/Resource";


async function create_resource(keywords: string): Promise<Resource | null> {

	let data: ResourceData;

	if (keywords.startsWith("https://www.youtube.com/watch")) {
		let regex_result: RegExpMatchArray | null;
		
		if (regex_result = keywords.match(/list=(.+?)(&|$)/)) {
			data = await youtube_api.PlaylistsItems(regex_result[1]);
			
			if (data['error'] || (data['items'].legnth === 0))
				return null;
			
			return new PlaylistResource(data);
		}
		else if (regex_result = keywords.match(/v=(.+?)(&|$)/)) {
			data = await youtube_api.Videos(regex_result[1]);

			if (data['error'] || (data['items'].legnth === 0))
				return null;

			return new VideoResource(data['items'][0]['id']);
		}

		return null;
	}

	data = await youtube_api.Search(keywords);
	
	for (const item of data['items']) {
		if (item['id']['kind'] == 'youtube#video') {
			return new VideoResource(item['id']['videoId']);
		}
	}

	return null;
}


const play = async (session: Session, message: Message, keywords: string) => {
	const player = session.player;

	if (!keywords)
		return "you need put something to search idot\n!play <something to search>";

	const user_channel = message.member?.voice.channel;
	if (!user_channel)
		return "you need to be in a channel stoopid";

	if (user_channel !== player.channel) {
		player.connect_to_channel(user_channel);
	}

	const new_resource: ResourceData = await create_resource(keywords);

	if (!new_resource)
		return `did not found a resource with the keywords <${keywords}>`

	player.push_song(new_resource);

	return `add to the queue\n${new_resource.info}`;
}

const play_help: string = "play <keywords> for playing a song";

export {play, play_help}