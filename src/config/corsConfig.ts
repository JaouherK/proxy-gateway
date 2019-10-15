
export const corsConfig = {
    origin: (origin: string, callback: any) => {
        callback(null, true);
        return;

    },
    credentials: true,
    exposedHeaders: ["Development", "Content-Type"]
};
