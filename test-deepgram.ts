import { createClient } from "@deepgram/sdk";

const deepgram = createClient("07da7586c9601b66ad6a91af36e085cd1289fbcb");

async function testDeepgramTTS() {
    try {
        console.log("🎙️ Testing Deepgram TTS...");

        const response = await deepgram.speak.request(
            { text: "Hello, this is a test." },
            {
                model: "aura-asteria-en",
                encoding: "linear16",
                sample_rate: 24000,
            }
        );

        console.log("✅ Response received");
        console.log("Response type:", typeof response);
        console.log("Response keys:", Object.keys(response));

        // Get audio stream
        const stream = await response.getStream();
        console.log("Stream type:", typeof stream);

        if (stream) {
            const reader = stream.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            const audioBuffer = Buffer.concat(chunks);
            console.log("✅ Audio buffer size:", audioBuffer.length, "bytes");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

testDeepgramTTS();
