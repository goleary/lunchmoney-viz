import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import styles from "../styles/Home.module.css";
import { LunchMoneyClient } from "../clients/lunchmoney";

type AssetsPageProps = {
  assets: any[];
};

const lunchmoney = new LunchMoneyClient();

export const getStaticProps: GetStaticProps<AssetsPageProps> = async () => {
  const assets = await lunchmoney.getAllAssets();
  return { props: { assets } };
};

const AssetsPage: React.FC<AssetsPageProps> = ({ assets }) => {
  console.log("assets: ", assets);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Assets</h1>
        <ul>
          {assets.map((asset) => (
            <li>
              {asset.institution_name}: <b>{asset.balance}</b> - {asset.type} -{" "}
              {asset.subtype}
            </li>
          ))}
        </ul>
        {/* <p className={styles.description}>
          <code className={styles.code}>{JSON.stringify(assets, null, 2)}</code>
        </p> */}
      </main>
    </div>
  );
};

export default AssetsPage;
