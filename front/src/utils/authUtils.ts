export const isTokenExpired = (token: string): boolean => {
    try {
        const payloadBase64 = token.split(".")[1];
        const decodePayload = JSON.parse(atob(payloadBase64));

        const expirationTime = decodePayload.exp * 1000;
        return Date.now() >= expirationTime;
    } catch {
        return true;
    }
};
