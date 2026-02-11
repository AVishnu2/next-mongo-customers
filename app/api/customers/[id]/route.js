
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("customersDB");

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return Response.json({ error: "Invalid ID" }, { status: 400 });
        }

        const customer = await db
            .collection("customers")
            .findOne({ _id: new ObjectId(id) });

        if (!customer) {
            return Response.json({ error: "Customer not found" }, { status: 404 });
        }

        return Response.json(customer);
    } catch (e) {
        console.error(e);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("customersDB");

        if (!ObjectId.isValid(id)) {
            return Response.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Remove _id from body if present to avoid immutable field error
        delete body._id;

        const result = await db.collection("customers").updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );

        if (result.matchedCount === 0) {
            return Response.json({ error: "Customer not found" }, { status: 404 });
        }

        return Response.json({ success: true });
    } catch (e) {
        console.error(e);
        return Response.json({ error: "Failed to update customer" }, { status: 500 });
    }
}
