import WebSocket from 'ws';
import {EmerilException} from './misc';
import axios, { AxiosRequestConfig, Method } from 'axios';
import {EventEmitter} from 'events';
import {API_VERSION, GatewayIntents, GATEWAY_VERSION, GatewayOpcodes, apiCall} from './constants';

import {inspect} from 'util';
import DiscordUser from './models/user';
import DiscordGuild from './models/guild';
import DiscordChannel from './models/channel';
import DiscordMessage from './models/message';
import Collection from './collection';

// @ts-ignore ts(80005)
const pkg: any = require('../package.json');

export enum EmerilState {
    SETUP,
    CONNECTING,
    READY,
    DEAD
}

interface EmerilConnectionInfo {
    heartbeatInterval: number;
    sequence: number | null;
    heartbeatHandle: NodeJS.Timeout;
}

const VERBOSE = true;

/**
 * The main interface between you and Emeril.
 * @extends EventEmitter
 */
export class EmerilClient extends EventEmitter {
    private _gatewayCache: string; 

    public token: string;
    public state: EmerilState = EmerilState.SETUP;

    private wsConnection: WebSocket;

    private connectionInfo: EmerilConnectionInfo = {
        heartbeatInterval: 0,
        sequence: null,
        heartbeatHandle: null
    };

    public me: DiscordUser;

    public guilds: Collection<DiscordGuild> = new Collection<DiscordGuild>();
    public channels: Collection<DiscordChannel> = new Collection<DiscordChannel>();
    public users: Collection<DiscordUser> = new Collection<DiscordUser>();

    public options: any = {};

    constructor(options: any = {}) {
        super();
        this.options = options;
    }

    public setToken(token: string): EmerilClient {
        if (this.state !== EmerilState.SETUP) {
            throw new EmerilException('Cannot change token while connected.');
        }
        this.token = token;
        return this;
    }

    public async callAPI(path: string, method: Method = 'post', data: any = null): Promise<any> {
        let uri = apiCall(path);
        let cfg: AxiosRequestConfig = {
            method: method,
            url: uri,
            data: data,
            headers: {
                Authorization: `Bot ${this.token}`
            }
        };
        return axios.request(cfg);
    }

    private async _updateGatewayCache(): Promise<void> {
        let req: any = await axios.get(apiCall('gateway'));
        let url: string = req.data.url;
        this._gatewayCache = url;
    }

    private _asyncSend(data: string | object): Promise<void> {
        return new Promise((resolve, reject) => {
            this.wsConnection.send((typeof(data) === 'object' ? JSON.stringify(data) : data),
            (err: Error) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    private async doHeartbeat(): Promise<void> {
        await this._asyncSend({
            op: GatewayOpcodes.HEARTBEAT,
            d: this.connectionInfo.sequence
        });
    }

    private async sendIdentify(): Promise<void> {
        let baseIntents = GatewayIntents.GUILD_MESSAGES +
                          GatewayIntents.DIRECT_MESSAGES +
                          GatewayIntents.GUILD_MESSAGE_REACTIONS +
                          GatewayIntents.GUILDS +
                          GatewayIntents.GUILD_BANS +
                          GatewayIntents.GUILD_EMOJIS

        let intents = baseIntents + (this.options.intents ?? 0);

        await this._asyncSend({
            op: GatewayOpcodes.IDENTIFY,
            d: {
                token: this.token,
                intents: intents,
                properties: {
                    '$os': process.platform,
                    '$browser': `emeril-${pkg.version}`,
                    '$device': 'emeril'
                },
                compress: false
            }
        });
        if (VERBOSE) console.log('[Emeril] identified')
    }

    private async onWebSocketMessage(data: WebSocket.Data): Promise<void> {
        let dataObject: any = JSON.parse(data as string);

        switch (dataObject.op) {
            case GatewayOpcodes.HELLO:
                this.connectionInfo.heartbeatInterval = dataObject.d.heartbeat_interval;
                this.connectionInfo.heartbeatHandle = setInterval(() => {
                    this.doHeartbeat();
                }, this.connectionInfo.heartbeatInterval);
                //if (VERBOSE) console.log(`[Emeril] received gateway HELLO, data: ${inspect(dataObject)}`)

                await this.sendIdentify();
                break;
            case GatewayOpcodes.HEARTBEAT_ACKNOWLEDGE:
                if (VERBOSE) console.log('[Emeril] heartbeat ack received');
                break;
            case GatewayOpcodes.HEARTBEAT:
                await this.doHeartbeat();
                break;
            case GatewayOpcodes.DISPATCH:
                await this.handleEvent(dataObject);
                break;
        }
        
        if (this.connectionInfo.sequence !== null && dataObject.s)
            this.connectionInfo.sequence = dataObject.s;
    }

    private async handleEvent(data: any) {
        let event = data.t;
        let edata = data.d;

        switch (event) {
            case 'READY':
                this.me = new DiscordUser(edata.user);
                for (let e of edata.guilds) {
                    let g = DiscordGuild.createUnavailableGuild(e.id);
                    this.guilds.update(g);
                }

                this.emit('ready');
                
                if (VERBOSE) console.log(`[Emeril] Ready! Logged in successfully as ${this.me.username}#${this.me.discriminator}`);
                //if (VERBOSE) console.log(`[Emeril] ${inspect(edata.guilds)}`);
                break;
            case 'GUILD_CREATE':
                let g = new DiscordGuild(edata, this);
                
                this.guilds.update(g);

                for (let i of g.channels) {
                    this.channels.update(i[1]);
                }

                if (VERBOSE) console.log(`[Emeril] GUILD_CREATE: ${g.name}`)
                break;
            case 'MESSAGE_CREATE':
                let chanid = edata.channel_id;
                let chan = this.channels.get(chanid);
                let ach = chan ? chan.asTextable() : null;

                let msg = new DiscordMessage(edata, ach, this);
                this.emit('messageCreate', msg);    

                break;
        }

        if (this.connectionInfo.sequence !== null && data.s)
            this.connectionInfo.sequence = data.s;
    }

    private async onWebSocketClose(code: number, reason: string): Promise<void> {
        console.log(`[Emeril] Websocket connection closed! Client is now dead. Code ${code}, reason ${reason}`);
        this.state = EmerilState.DEAD;
        clearInterval(this.connectionInfo.heartbeatHandle);
    }

    public async connect(): Promise<EmerilClient> {
        if (!this._gatewayCache) {
            await this._updateGatewayCache();
        }

        let constructedURL = `${this._gatewayCache}?v=${GATEWAY_VERSION}&encoding=json`;

        this.wsConnection = new WebSocket(constructedURL);
        this.wsConnection.on('message', (data: WebSocket.Data) => {
            this.onWebSocketMessage(data);
        });

        this.wsConnection.on('open', () => {
            if (VERBOSE) console.log(`[Emeril] opened ws @ ${constructedURL}`);
        })

        this.wsConnection.on('close', (code:number, reason:string) => {
            this.onWebSocketClose(code, reason);
        })

        return this;
    }
}