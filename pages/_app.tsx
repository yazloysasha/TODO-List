import "@styles/base.css";
import Head from "next/head";
import { ReactNode } from "react";
import { AppProps } from "next/app";
import MainLayout from "@components/MainLayout";

export default function App({ Component, pageProps }: AppProps): ReactNode {
  return (
    <>
      <Head>
        <link rel="icon" href="gte.png" type="image/png" />
      </Head>

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}
