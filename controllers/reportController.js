const prisma = require("../db.js");

const getReports = async (req, res) => {
  try {
    const reports = await prisma.reports.findMany({
      include: {
        users: true,           // <--- use 'users', not 'user'
        report_comments: true, // optional if you want comments
        report_likes: true,    // optional if you want likes
        report_media: true,    // optional if you want media
      },
      orderBy: { created_at: "desc" },
    });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

module.exports = { getReports };
