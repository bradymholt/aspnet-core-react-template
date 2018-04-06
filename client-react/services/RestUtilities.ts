import AuthStore from '../stores/Auth';

export interface IErrorContent {
    error: string;
    error_description: string;
    [key: string]: string;
}

export interface IRestResponse<T> {
    is_error?: boolean;
    error_content?: IErrorContent,
    content?: T
};

export default class RestUtilities {

    static get<T>(url: string): Promise<IRestResponse<T>> {
        return RestUtilities.request<T>('GET', url);
    }

    static delete(url: string): Promise<IRestResponse<void>> {
        return RestUtilities.request<void>('DELETE', url);
    }

    static put<T>(url: string, data: Object | string): Promise<IRestResponse<T>> {
        return RestUtilities.request<T>('PUT', url, data);
    }

    static post<T>(url: string, data: Object | string): Promise<IRestResponse<T>> {
        return RestUtilities.request<T>('POST', url, data);
    }

    private static request<T>(method: string, url: string, data: Object | string = null): Promise<IRestResponse<T>> {

        let isJsonResponse: boolean = false;
        let isBadRequest = false;
        let body = data;
        let headers = new Headers();

        headers.set('Authorization',`Bearer ${AuthStore.getToken()}`);
        headers.set('Accept','application/json');

        if (data) {
            if ((typeof data === 'object')) {
                headers.set('Content-Type','application/json');
                body = JSON.stringify(data);
            } else {
                headers.set('Content-Type','application/x-www-form-urlencoded');
            }
        }

        return fetch(url, {
            method: method,
            headers: headers,
            body: <any>body,
        }).then((response) => {
            if (response.status == 401) {
                // Unauthorized; redirect to sign-in
                AuthStore.removeToken();
                window.location.replace(`/?expired=1`);
            }

            isBadRequest = (response.status == 400);

            let responseContentType = response.headers.get("content-type");
            if (responseContentType && responseContentType.indexOf("application/json") !== -1) {
                isJsonResponse = true;
                return response.json();
            } else {
                return response.text();
            }
        }).then((responseContent: any) => {
            let response: IRestResponse<T> = {
                is_error: isBadRequest,
                error_content: isBadRequest ? responseContent : null,
                content: isBadRequest ? null : responseContent
            };
            return response;
        });
    }
}
