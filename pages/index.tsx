import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>KaChing Cash Register Admin Panel</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>KaChing Cash Register Admin Panel</h1>

      <section id="dashboard">
        <nav>{'sidebar navigation'}</nav>
        <header>{'header'}</header>
        <main>{'main content'}</main>
      </section>

      <footer className={styles.footer}>Powered by UnCaged Studios</footer>
    </div>
  );
}
