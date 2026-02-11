"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function EditCustomer() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        if (id) {
            fetch(`/api/customers/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then((data) => {
                    setFormData({
                        name: data.name || "",
                        email: data.email || "",
                        address: {
                            street: data.address?.street || "",
                            city: data.address?.city || "",
                            state: data.address?.state || "",
                            zip: data.address?.zip || "",
                        }
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    alert("Failed to load customer data");
                    router.push("/");
                });
        }
    }, [id, router]);

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
        setSaving(true);

        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push(`/customers/${id}`);
                router.refresh();
            } else {
                alert("Failed to update customer");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <main className={styles.container}>
            <Link href={`/customers/${id}`} className={styles.backLink}>
                ← Back to Details
            </Link>

            <h1 className={styles.title}>Edit Customer</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                        name="name"
                        required
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
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
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Street</label>
                    <input
                        name="address.street"
                        className={styles.input}
                        value={formData.address.street}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>City</label>
                    <input
                        name="address.city"
                        className={styles.input}
                        value={formData.address.city}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>State</label>
                    <input
                        name="address.state"
                        className={styles.input}
                        value={formData.address.state}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Zip Code</label>
                    <input
                        name="address.zip"
                        className={styles.input}
                        value={formData.address.zip}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </main>
    );
}
