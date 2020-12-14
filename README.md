# Emeril
*Another Discord library.*

## What is Emeril?
Emeril is a **super-light-weight** library for interacting with [Discord](https://discord.com).
Emeril was written in a day by [Rin](https://kagamine-r.in), out of boredom.

## How do I use Emeril?
There's no npm package ~~yet~~, but after installing the library, you can do this:
```ts
import {EmerilClient} from 'emeril';

// ... do things ...
let client = await new EmerilClient().setToken('TOKEN_HERE').connect();
```
This is the simplest possible Emeril bot. It goes online and that's it.

## Where'd the name come from?
[No Man's Sky](https://nomanssky.gamepedia.com/Emeril).