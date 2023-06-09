interface Response<T> {
    body: T;
    headers: Record<string, string>;
    statusCode: number;
}

interface RegisterSpotifyCommand {
    commandId: string;
    successMsg: string;
    handlerId?: string;
    payload?: any;
    protectedCommand?: boolean;
}
