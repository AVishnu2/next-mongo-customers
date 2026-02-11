import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("customersDB");

  const customers = await db
    .collection("customers")
    .find({})
    .toArray();

  return Response.json(customers);
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("customersDB");
    const body = await request.json();

    const result = await db.collection("customers").insertOne(body);

    return Response.json({ _id: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
