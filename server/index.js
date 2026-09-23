import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import { generateStudyMaterial } from './gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root workspace first, then fallback to current directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer memory storage for PDF and TXT uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/octet-stream',
    ];
    const isAllowedExt = /\.(pdf|txt|md)$/i.test(file.originalname);

    if (allowedMime.includes(file.mimetype) || isAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .txt, and .md files are supported.'));
    }
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(
    key && key.trim() !== '' && key !== 'your_gemini_api_key_here'
  );

  res.json({
    status: 'ok',
    geminiKeyConfigured: isKeyConfigured,
    port: PORT,
  });
});

// Main generation endpoint
app.post('/api/generate', upload.single('file'), async (req, res) => {
  try {
    let extractedText = '';

    // Handle uploaded file if present
    if (req.file) {
      const { originalname, mimetype, buffer } = req.file;

      if (mimetype === 'application/pdf' || originalname.toLowerCase().endsWith('.pdf')) {
        try {
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text || '';
        } catch (pdfErr) {
          console.error('PDF parsing error:', pdfErr);
          return res.status(400).json({
            success: false,
            error: `Failed to parse PDF document: ${pdfErr.message}`,
          });
        }
      } else {
        // Plain text / markdown
        extractedText = buffer.toString('utf-8');
      }
    }

    // Append / use raw text pasted from textarea
    const pastedText = req.body?.text || '';
    let combinedText = '';

    if (extractedText.trim() && pastedText.trim()) {
      combinedText = `${extractedText.trim()}\n\nAdditional Notes:\n${pastedText.trim()}`;
    } else if (extractedText.trim()) {
      combinedText = extractedText.trim();
    } else if (pastedText.trim()) {
      combinedText = pastedText.trim();
    }

    if (!combinedText || combinedText.trim().length < 15) {
      return res.status(400).json({
        success: false,
        error:
          'Please provide more content. Provide at least 15 characters of study notes or upload a PDF/.txt file.',
      });
    }

    console.log(`[API] Processing study material (~${combinedText.length} chars)...`);
    const studyData = await generateStudyMaterial(combinedText);

    return res.json({
      success: true,
      data: studyData,
    });
  } catch (error) {
    console.error('[API Error in /api/generate]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error occurred while processing study notes.',
    });
  }
});

// Global error handler (e.g. Multer limit errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: `File upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message || 'An unexpected error occurred.' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 AI Study Assistant Server running on http://localhost:${PORT}`);
});
