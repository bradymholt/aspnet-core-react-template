import 'whatwg-fetch';

export default class authentication {
    static STORAGE_KEY: string = "token";

    static request(url: string, contentType: string, body: string) {
        let isBadRequest = false;

        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': contentType },
            body: body
        }).then((response) => {
            isBadRequest = (response.status == 400);
            return response.json();
        }).then((json:any) => {
            if (isBadRequest) {
                json = { error: json }
            }

            return json;
        });
    }

    static login(email: string, password: string): Promise<any> {
        return authentication.request('/api/auth/login', 'application/x-www-form-urlencoded',
            `username=${email}&password=${password}&grant_type=password`
        ).then((response: any) => {
            if (!response.error) {
                localStorage.setItem(this.STORAGE_KEY, response.access_token);
            }
            return response;
        });
    }

    static register(email: string, password: string): Promise<any> {
        return authentication.request('/api/auth/register', 'application/json',
            JSON.stringify({ email: email, password: password })
        );
    }

    static confirm(token: string): Promise<boolean> {
        return authentication.request('/api/auth/confirm', 'application/json',
            JSON.stringify({ token: token })
        ).then((response: any) => {
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
