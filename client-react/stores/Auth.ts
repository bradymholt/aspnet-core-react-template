export default class Auth {
    static STORAGE_KEY: string = "token";

    static getToken() {
        return localStorage.getItem(Auth.STORAGE_KEY);
    }

    static setToken(token: string) {
        localStorage.setItem(Auth.STORAGE_KEY, token);
    }

    static removeToken(): void {
        localStorage.removeItem(Auth.STORAGE_KEY);
    }
}
