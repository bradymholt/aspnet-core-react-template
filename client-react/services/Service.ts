import 'whatwg-fetch';
import AuthService from '../services/Auth';
import AuthStore from '../stores/Auth';

export default class Service {
    getJSON(url: string) {
        let isBadRequest = false;
        let isJsonResponse = false;
        let authToken = AuthStore.getToken();

        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then((response) => {
            if (response.status == 401) {
                // Unauthorized; redirect to sign-in
                AuthStore.removeToken();
                window.location.replace("/sign-in/?expired=1");
                return false;
            }

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

    post(url: string, data: Object | string) {
        let contentType = (typeof data === 'object') ? 'application/json' : 'application/x-www-form-urlencoded';
        let isBadRequest = false;
        let isJsonResponse = false;
        let authToken = AuthStore.getToken();

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'Authorization': `Bearer ${authToken}`
            },
            body: data,
        }).then((response) => {
            if (response.status == 401) {
                // Unauthorized; redirect to sign-in
                AuthStore.removeToken();
                window.location.replace("/sign-in/?expired=1");
                return false;
            }

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
}
