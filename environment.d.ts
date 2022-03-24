declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            API_KEY_IMGUR: string;
            guildId: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};