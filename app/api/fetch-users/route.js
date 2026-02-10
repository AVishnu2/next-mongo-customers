import clientPromise from "@/lib/mongodb";

export async function GET() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  const client = await clientPromise;
  const db = client.db("customersDB");
  const collection = db.collection("customers");

  for (let user of users) {
    const exists = await collection.findOne({ email: user.email });

    if (!exists) {
      await collection.insertOne(user);
    }
  }

  return Response.json({ message: "Users stored successfully" });
}
