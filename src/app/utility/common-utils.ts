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

export function GetFormattedCurrentDatetime(now: Date): string {
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}