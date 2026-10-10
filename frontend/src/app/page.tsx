import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>University Alumni Association Platform</h1>
        <p>Welcome to the alumni platform.</p>
      </main>
    </div>
  );
}
