"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching customers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Customer Directory</h1>
          <p className={styles.subtitle}>Manage and view all your customer information</p>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No customers yet</p>
            <p className={styles.emptyText}>Start adding customers to see them here</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {customers.map(user => (
              <div key={user._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                  <div className={styles.cardMeta}>
                    <h3 className={styles.cardTitle}>{user.name}</h3>
                    <p className={styles.cardId}>ID: {user._id.substring(0, 8)}...</p>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.field}>
                    <span className={styles.label}>Email</span>
                    <a href={`mailto:${user.email}`} className={styles.value}>{user.email}</a>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Phone</span>
                    <a href={`tel:${user.phone}`} className={styles.value}>{user.phone}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
