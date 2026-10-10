export const S = {
  station: 'chat',
  connected: { chat: false, hermes: false } as Record<string, boolean>,
  provider: null as string | null,
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
export let W: any = null;

export function setW(val: any) {
  W = val;
}

