import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { AccountGatewayHttp } from './gateways/AccountGateway.ts';
import { AxiosAdapter, FetchAdapter } from './infra/http/HttpClient.ts';

// const httpClient = new FetchAdapter();
const httpClient = new AxiosAdapter();
const accountGateway = new AccountGatewayHttp(httpClient);
const app = createApp(App);
app.provide("accountGateway", accountGateway);
app.mount('#app')
