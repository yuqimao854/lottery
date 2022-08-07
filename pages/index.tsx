import type { NextPage } from "next";
import Head from "next/head";
import { TurnTable, Weekend } from "../components";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>抽奖</title>
      </Head>
      {/* <TurnTable /> */}
      <Weekend />
    </div>
  );
};

export default Home;
