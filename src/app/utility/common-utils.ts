import {AuthenticationService} from "../service/authentication/authentication.service";

export async function get_ip_address() {
    try {
        let response = await fetch("https://api.ipify.org/?format=json", {
            method: 'GET',
        });

        let res = await response.json();

        return res.ip;
    } catch {
        console.log("Internal server error");
    }

    return null;
}

export function do_logout(navigate: string) {
    authService: AuthenticationService
    // authService.DoLogout();
    localStorage.removeItem("JWT");
    redirect_to_login(navigate);
}

export function redirect_to_login(navigate: string){
    setTimeout(() => {
        //navigate(`/login`);
    }, 500);
}

export function redirect_to_home(){
    window.location.href = "layout";
}

export function go_back(navigate: string){
    // navigate(-1);
}