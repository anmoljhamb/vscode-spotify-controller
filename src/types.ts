interface Response<T> {
    body: T;
    headers: Record<string, string>;
    statusCode: number;
}
