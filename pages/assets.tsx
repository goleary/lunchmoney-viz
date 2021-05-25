import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

import styled from "styled-components";

import styles from "../styles/Home.module.css";
import { LunchMoneyClient } from "../clients/lunchmoney";
import Table from "../components/Table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

type AssetsPageProps = {
  assets: any[];
};

const lunchmoney = new LunchMoneyClient();

export const getStaticProps: GetStaticProps<AssetsPageProps> = async () => {
  const assets = await lunchmoney.getAllAssets();
  return { props: { assets } };
};
// Create our number formatter.
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const AssetsPage: React.FC<AssetsPageProps> = ({ assets }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Type",
        columns: [
          {
            Header: "Primary",
            accessor: "type",
          },
          {
            Header: "Secondary",
            accessor: "subtype",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          { Header: "Institution", accessor: "institution_name" },
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Balance",
            accessor: "balance",
            Cell: ({ value }) => (
              <div style={{ textAlign: "right", fontWeight: 600 }}>
                {usd.format(value)}
              </div>
            ),
          },
          {
            Header: "Status",
            accessor: "status",
          },
        ],
      },
    ],
    []
  );
  console.log("assets: ", assets);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Assets</h1>
        <Styles>
          <Table columns={columns} data={assets} />
        </Styles>
        {/* <p className={styles.description}>
          <code className={styles.code}>{JSON.stringify(assets, null, 2)}</code>
        </p> */}
      </main>
    </div>
  );
};

export default AssetsPage;
