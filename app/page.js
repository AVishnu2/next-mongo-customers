"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Customers</h1>

      {customers.map(user => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
