import axios from "axios";

axios.defaults.validateStatus = () => true;

export default interface HttpClient {
    post (url: string, body: any): Promise<any>;
}

export class FetchAdapter implements HttpClient {

    async post(url: string, body: any): Promise<any> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const output = await response.json();
        return output;
    }

}

export class AxiosAdapter implements HttpClient {

    async post(url: string, body: any): Promise<any> {
        const response = await axios.post(url, body);
        const output = response.data;
        return output;
    }

}
