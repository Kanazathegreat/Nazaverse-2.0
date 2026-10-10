export declare const SKINS: Record<string, {
    n: string;
    free: boolean;
    v: Record<string, string>;
}>;
export declare const LINES: Record<string, any>;
export declare function pick(a: any[]): any;
export declare function getLine(ev: string): any;
export declare function applySkin(id: string): void;
export declare class PetController {
    st: string;
    back: any;
    capT: any;
    lastAct: number;
    looks: Record<string, [number, number]>;
    constructor();
    init(): void;
    look(x: number, y: number): void;
    say(text: string, ms?: number): void;
    set(s: string, o?: any): void;
    wake(): void;
    touch(): void;
    glance(x: number): void;
    get state(): string;
}
export declare const pet: PetController;
//# sourceMappingURL=pet.d.ts.map