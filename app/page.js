"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Simple icons as components
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.searchIcon}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.icon}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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
          <p>Manage your relationships with style.</p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/customers/new" className={styles.newBtn}>
            <PlusIcon /> New Customer
          </Link>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <SearchIcon />
            <input
              className={styles.search}
              placeholder="Search by name, email, or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.stats}>
            {loading ? "Loading..." : `${filtered.length} Customer${filtered.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>
            <p>Loading your customers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No customers found matching "{query}".</p>
          </div>
        ) : (
          <ul className={styles.grid}>
            {filtered.map((c, i) => (
              <Link key={c._id || i} href={`/customers/${c._id}`} className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className={styles.avatar}>{initials(c.name)}</div>
                </div>

                <div className={styles.info}>
                  <div className={styles.name}>{c.name}</div>
                  <div className={styles.email}>{c.email}</div>
                </div>

                <div className={styles.meta}>
                  <LocationIcon />
                  <span className={styles.city}>{c.address?.city || "Unknown City"}</span>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
