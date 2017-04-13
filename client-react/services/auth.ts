import 'whatwg-fetch';

export default class Auth {
    static STORAGE_KEY: string = "token";

    static login(username: string, password: string): Promise<boolean> {
        return fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${username}&password=${password}&grant_type=password`
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error("Invalid login");
            }
        }).then((response:any) => {
            localStorage.setItem(this.STORAGE_KEY, response.access_token);
            console.log(response);
            return true;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    static isLoggedIn(): boolean {
        return !!localStorage.getItem(this.STORAGE_KEY);
    }

    static getToken() {
        return localStorage.getItem(this.STORAGE_KEY);
    }

    static logout(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
