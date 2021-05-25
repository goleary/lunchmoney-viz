import axios, { AxiosInstance } from "axios";

// Types

export interface PlaidAccounts {
  plaid_accounts: PlaidAccount[];
}

export interface PlaidAccount {
  id: number;
  date_linked: Date;
  name: string;
  type: string;
  subtype: null | string;
  mask: null | string;
  institution_name: string;
  status: Status;
  last_import: Date | null;
  balance: string;
  currency: Currency;
  balance_last_update: Date;
  limit: number | null;
}

type Currency = "usd" | string;

export enum Status {
  Active = "active",
  NotSupported = "not supported",
}

export interface ManualAssets {
  assets: ManualAsset[];
}

export interface ManualAsset {
  id: number;
  type_name: string;
  subtype_name: null | string;
  name: string;
  balance: string;
  balance_as_of: Date;
  currency: string;
  institution_name: null | string;
  created_at: Date;
}

type Asset = {
  name: string;
  type: string;
  subtype: null | string;
  institution_name: string;
  balance: number;
  currency: Currency;
};

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
    const { assets } = response.data as ManualAssets;
    return assets;
  }
  async getPlaidAccounts() {
    const response = await this.http.get(
      "https://dev.lunchmoney.app/v1/plaid_accounts"
    );
    const { plaid_accounts } = response.data as PlaidAccounts;
    return plaid_accounts;
  }
  async getAllAssets(): Promise<Asset[]> {
    const manualAssets = await this.getManualAssets();
    const plaidAccounts = await this.getPlaidAccounts();
    const assets = [
      ...manualAssets.map(
        ({
          name,
          type_name,
          subtype_name,
          balance,
          institution_name,
          currency,
        }): Asset => ({
          name,
          type: type_name,
          subtype: subtype_name,
          institution_name,
          balance: parseFloat(balance),
          currency,
        })
      ),
      ...plaidAccounts.map(
        ({
          name,
          type,
          subtype,
          balance,
          institution_name,
          currency,
        }): Asset => ({
          name,
          type,
          subtype,
          institution_name,
          balance: parseFloat(balance),
          currency,
        })
      ),
    ];

    return assets;
  }
}
