"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function NewCustomer() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip: "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const keys = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                // Redirect to detail page
                router.push(`/customers/${data._id}`);
                router.refresh();
            } else {
                alert("Failed to create customer");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <Link href="/" className={styles.backLink}>
                ← Back to Customers
            </Link>

            <h1 className={styles.title}>New Customer</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                        name="name"
                        required
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Street</label>
                    <input
                        name="address.street"
                        className={styles.input}
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="123 Main St"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>City</label>
                    <input
                        name="address.city"
                        className={styles.input}
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="New York"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>State</label>
                    <input
                        name="address.state"
                        className={styles.input}
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="NY"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Zip Code</label>
                    <input
                        name="address.zip"
                        className={styles.input}
                        value={formData.address.zip}
                        onChange={handleChange}
                        placeholder="10001"
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Creating..." : "Create Customer"}
                </button>
            </form>
        </main>
    );
}
