
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import styles from "./page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";

// Reuse the module CSS or creating a new one? 
// For simplicity and consistency, I'll use a new module file for this page 
// or inline styles if it's simple enough, but a module is better.
// Let's assume we'll create a module for it or reuse some global classes.
// Actually, I'll create `app/customers/[id]/page.module.css` in the next step.

async function getCustomer(id) {
    try {
        const client = await clientPromise;
        const db = client.db("customersDB");
        const customer = await db
            .collection("customers")
            .findOne({ _id: new ObjectId(id) });
        return customer;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export default async function CustomerPage({ params }) {
    const { id } = await params;
    const customer = await getCustomer(id);

    if (!customer) {
        notFound();
    }

    const initials = customer.name
        ? customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <main className={styles.container}>
            <Link href="/" className={styles.backLink}>
                ← Back to Customers
            </Link>

            <div className={styles.header}>
                <div className={styles.avatarLarge}>{initials}</div>
                <div>
                    <h1 className={styles.name}>{customer.name}</h1>
                    <p className={styles.email}>{customer.email}</p>
                </div>
            </div>

            <div className={styles.card}>
                <section className={styles.section}>
                    <h2>Contact Information</h2>
                    <div className={styles.row}>
                        <span className={styles.label}>Email</span>
                        <span className={styles.value}>{customer.email}</span>
                    </div>
                    {/* Add more fields if they exist in your schema, e.g. phone */}
                </section>

                <section className={styles.section}>
                    <h2>Address</h2>
                    <div className={styles.row}>
                        <span className={styles.label}>Street</span>
                        <span className={styles.value}>{customer.address?.street || "—"}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>City</span>
                        <span className={styles.value}>{customer.address?.city || "—"}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>State</span>
                        <span className={styles.value}>{customer.address?.state || "—"}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Zip Code</span>
                        <span className={styles.value}>{customer.address?.zip || "—"}</span>
                    </div>
                </section>
            </div>
        </main>
    );
}
