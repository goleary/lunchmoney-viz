import axios, { AxiosInstance } from "axios";

export class LunchMoneyClient {
  http: AxiosInstance;
  constructor() {
    this.http = axios.create({
      headers: {
        Authorization: `Bearer ${process.env.LUNCH_MONEY_ACCESS_TOKEN}`,
      },
    });
  }
  async getManualAssets() {
    const response = await this.http.get(
      "https://dev.lunchmoney.app/v1/assets"
    );
    const { assets } = response.data;
    return assets;
  }
  async getPlaidAccounts() {
    const response = await this.http.get(
      "https://dev.lunchmoney.app/v1/plaid_accounts"
    );
    const { plaid_accounts } = response.data;
    return plaid_accounts;
  }
  async getAllAssets() {
    const manualAssets = await this.getManualAssets();
    const plaidAccounts = await this.getPlaidAccounts();
    const assets = [...manualAssets, ...plaidAccounts];

    return assets.filter(({ balance }) => parseFloat(balance) > 0);
  }
}
