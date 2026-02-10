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
