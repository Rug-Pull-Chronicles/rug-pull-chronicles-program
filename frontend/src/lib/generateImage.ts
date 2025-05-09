import axios from "axios";

export const generateImage = async (selectedScam: {
  headline: string;
  type_of_attack: string;
  category: string;
  amount_usd: string;
  year: string;
}) => {
  try {
    const payload = {
      prompt: `A detailed rug/carpet with patterns representing the crypto scam "${selectedScam.headline}". The rug's central pattern shows ${selectedScam.type_of_attack} symbolism, border colors reflect ${selectedScam.category} theme, with ${selectedScam.amount_usd} influencing the complexity and richness of the design. Year ${selectedScam.year} subtly woven into the corner. The rug is photographed in a luxurious setting, slightly pulled back on one corner revealing the scam underneath.`,
      output_format: "webp",
    };

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(payload),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: "image/webp" });
      return blob;
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (err) {
    throw new Error(
      `Failed to generate image: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
};
