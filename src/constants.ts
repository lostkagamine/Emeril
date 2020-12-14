export const API_VERSION: number = 8;
export const GATEWAY_VERSION: number = 8;

export const API_URL = `https://discord.com/api/v${API_VERSION}`;

export function apiCall(path: string): string {
    return `${API_URL}/${path}`;
}

// https://discord.com/developers/docs/topics/gateway#gateway-intents
export enum GatewayIntents {
    GUILDS = 1<<0,
    GUILD_MEMBERS = 1<<1,
    GUILD_BANS = 1<<2,
    GUILD_EMOJIS = 1<<3,
    GUILD_INTEGRATIONS = 1<<4,
    GUILD_WEBHOOKS = 1<<5,
    GUILD_INVITES = 1<<6,
    GUILD_VOICE_STATES = 1<<7,
    GUILD_PRESENCES = 1<<8,
    GUILD_MESSAGES = 1<<9,
    GUILD_MESSAGE_REACTIONS = 1<<10,
    GUILD_MESSAGE_TYPING = 1<<11,
    DIRECT_MESSAGES = 1<<12,
    DIRECT_MESSAGE_REACTIONS = 1<<13,
    DIRECT_MESSAGE_TYPING = 1<<14
};

// https://discord.com/developers/docs/topics/opcodes-and-status-codes
export enum GatewayOpcodes {
    DISPATCH = 0,
    HEARTBEAT = 1,
    IDENTIFY = 2,
    PRESENCE_UPDATE = 3,
    VOICE_STATE_UPDATE = 4,
    MYSTERY = 5, /* This one is not documented.
                    I don't know what it is for.
                    But the next one is 6.
                    And the previous one is 4. */
    RESUME = 6,
    RECONNECT = 7,
    REQUEST_GUILD_MEMBERS = 8,
    INVALID_SESSION = 9,
    HELLO = 10,
    HEARTBEAT_ACKNOWLEDGE = 11
};

export enum DiscordChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE = 6
};

// https://discord.com/developers/docs/topics/permissions
export enum Permission {
    CREATE_INSTANT_INVITE = 0x1,
    KICK_MEMBERS = 0x2,
    BAN_MEMBERS = 0x4,
    ADMINISTRATOR = 0x8,
    MANAGE_CHANNELS = 0x10,
    MANAGE_GUILD = 0x20,
    ADD_REACTIONS = 0x40,
    VIEW_AUDIT_LOG = 0x80,
    PRIORITY_SPEAKER = 0x100,
    STREAM = 0x200,
    VIEW_CHANNEL = 0x400,
    SEND_MESSAGES = 0x800,
    SEND_TTS_MESSAGES = 0x1000,
    MANAGE_MESSAGES = 0x2000,
    EMBED_LINKS = 0x4000,
    ATTACH_FILES = 0x8000,
    READ_MESSAGE_HISTORY = 0x10000,
    MENTION_EVERYONE = 0x20000,
    USE_EXTERNAL_EMOJIS = 0x40000, // sic
    VIEW_GUILD_INSIGHTS = 0x80000,
    CONNECT = 0x100000,
    SPEAK = 0x200000,
    MUTE_MEMBERS = 0x400000,
    DEAFEN_MEMBERS = 0x800000,
    MOVE_MEMBERS = 0x1000000,
    USE_VAD = 0x2000000,
    CHANGE_NICKNAME = 0x4000000,
    MANAGE_NICKNAMES = 0x8000000,
    MANAGE_ROLES = 0x10000000,
    MANAGE_WEBHOOKS = 0x20000000,
    MANAGE_EMOJI = 0x40000000
};