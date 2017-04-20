import Service from './Service';
import AuthStore from '../stores/Auth';

export default class Auth extends Service {
    static isSignedInIn(): boolean {
        return !!AuthStore.getToken();
    }

    signInOrRegister(email: string, password: string, isRegister: boolean = false): Promise<any> {
        return this.post(`/api/auth/${isRegister ? 'register' : 'login'}`,
            `username=${email}&password=${password}${!isRegister ? '&grant_type=password' : ''}`)
            .then((response: any) => {
                if (!response.error) {
                    AuthStore.setToken(response.access_token);
                }
                return response;
            });
    }

    signIn(email: string, password: string): Promise<any> {
        return this.signInOrRegister(email, password, false);
    }

    register(email: string, password: string): Promise<any> {
        return this.signInOrRegister(email, password, true);
    }

    confirm(token: string): Promise<boolean> {
        return this.post('/api/auth/confirm', { token: token })
            .then((response: any) => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });
    }

    signOut(): void {
        AuthStore.removeToken();
    }
}
