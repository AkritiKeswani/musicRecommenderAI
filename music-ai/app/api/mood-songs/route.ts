import { Document, VectorStoreIndex } from "llamaindex";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { mood } = await request.json();

  try {
    // Load your JSON data
    const moodSongs = require("../../../data/songs.json");

    // Convert JSON data to documents
    const documents = moodSongs.map(
      (item: any) =>
        new Document({
          text: `Mood: ${item.mood}, Song: ${item.song}, Artist: ${item.artist}`,
        }),
    );

    // Create the index
    const index = await VectorStoreIndex.fromDocuments(documents);

    // Create query engine
    const queryEngine = index.asQueryEngine();

    // Generate query
    const query = `Recommend a song for someone feeling ${mood}`;

    // Get response
    const response = await queryEngine.query(query);

    return NextResponse.json({ recommendation: response.toString() });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
}
