import 'whatwg-fetch';

export default class authentication {
    static STORAGE_KEY: string = "token";

    static request(url: string, contentType: string, body: string) {
        let isBadRequest = false;
        let isJsonResponse = false

        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': contentType },
            body: body
        }).then((response) => {
            isBadRequest = (response.status == 400);

            let contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                isJsonResponse = true;
                return response.json();
            } else {
                return response.text();
            }
        }).then((responseContent: any) => {
            let response = responseContent;
            if (isBadRequest) {
                if (isJsonResponse && !responseContent.error) {
                    response = { error: responseContent }
                }
            }

            return response;
        });
    }

    static loginOrRegister(email: string, password: string, isRegister: boolean = false): Promise<any> {
        return authentication.request(`/api/auth/${isRegister ? 'register' : 'login'}`, 'application/x-www-form-urlencoded',
            `username=${email}&password=${password}${!isRegister ? '&grant_type=password' : ''}`

        ).then((response: any) => {
            if (!response.error) {
                localStorage.setItem(this.STORAGE_KEY, response.access_token);
            }
            return response;
        });
    }

    static login(email: string, password: string): Promise<any> {
        return this.loginOrRegister(email, password, false);
    }

    static register(email: string, password: string): Promise<any> {
        return this.loginOrRegister(email, password, true);
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
