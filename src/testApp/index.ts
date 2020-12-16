import { GatewayIntents } from '../constants';
import {EmerilClient} from '../index';
import { MissingPermissions } from '../misc';
import DiscordMessage from '../models/message';
import {TOKEN} from './config';

async function test() {
    let client = await new EmerilClient({
        //intents: GatewayIntents.GUILD_MEMBERS
    }).setToken(TOKEN).connect();

    client.on('ready', () => {
        console.log(`client fired ready, logged in as ${client.me.username}#${client.me.discriminator}`)
    });

    client.on('messageCreate', async (msg: DiscordMessage) => {
        if (msg.author.bot) return;

        if (msg.content === '!!!!!test') {
            //console.log(msg.channel);
            msg.channel.createMessage('hello from Emeril!')
        }

        if (msg.content.startsWith('!!!!!eval') && msg.author.id === '190544080164487168') {
            let e = msg.content.slice(10);
            let h;
            let wrapper = `(async () => {${e}})()`;
            try {
                h = await eval(wrapper)
            } catch(e) {
                return msg.channel.createMessage(`\`\`\`ts\n${e}\n\`\`\``)
            }
            msg.channel.createMessage(`\`\`\`ts\n${h}\n\`\`\``);
        }

        if (msg.content === '!!!!!dmme') {
            try {
                let dmch = await msg.member!!.dmChannel();
                await dmch.createMessage('boop');
            } catch(e) {
                await msg.channel.createMessage('something went wrong');
                console.log(e);
            }
        }
    })

    client.on('error', async (err: any) => {
        if (err instanceof MissingPermissions) {
            console.log('missing perms')
        }
        console.log(`shit: ${err}`);
    });
}

/*
        let guild = '110373943822540800';
        let id = '132632676225122304';
    
        let go = client.guilds.find(e => e.id === guild);
        let ch = go.channels.find(e => e.id === id);

        ch.asTextable().createMessage('testing 1 2 3');
*/

test();