export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      console.log("Form submission received:", data);

      return res.status(200).json({ message: "Form submission received" });
    } catch (error) {
      console.error("Error processing submission:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}
