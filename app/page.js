"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return (
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.address?.city?.toLowerCase().includes(q)
    );
  });

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>Customer Hub</h1>
          <p>Clean, fast & delightful customer list</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.newBtn}>+ New</button>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Search name, email or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.stats}>{loading ? "…" : `${filtered.length} customer${filtered.length !== 1 ? "s" : ""}`}</div>
        </div>

        {loading ? (
          <div className={styles.empty}>Loading customers…</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No customers found.</div>
        ) : (
          <ul className={styles.grid}>
            {filtered.map((c, i) => (
              <li key={i} className={styles.card}>
                <div className={styles.avatar}>{initials(c.name)}</div>
                <div className={styles.info}>
                  <div className={styles.name}>{c.name}</div>
                  <div className={styles.email}>{c.email}</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.city}>{c.address?.city || "—"}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
