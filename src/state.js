export const S = {
    station: 'chat',
    connected: { chat: false, hermes: false },
    provider: null,
    awake: false,
    busy: false,
    mode: 'ask',
    web: true,
    sky: true,
    focus: false,
    pet: { name: 'Nova', persona: 'cheerful', custom: '' },
    skin: 'galaxy',
    unlocked: false
};
export const IDX = { chat: 0, hermes: 0 };
export let W = null;
export function setW(val) {
    W = val;
}
//# sourceMappingURL=state.js.map