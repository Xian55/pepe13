declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            API_KEY_IMGUR: string;
            guildId: string;
            MONGO_URI: string;
            environment: "dev" | "prod" | "debug";
            plebek_post: string;
            data_path: string;
        }
    }
}

export { };