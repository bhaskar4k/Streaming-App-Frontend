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

export function redirect_to_home(){
    window.location.href = "home";
}

export function go_back(navigate: any){
    navigate(-1);
}

export function base64toImage(base64: string): string {
    return `data:image/jpeg;base64,${base64}`
}