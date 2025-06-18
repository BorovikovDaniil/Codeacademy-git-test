const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

const upload = multer();
const app = express();
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

app.post('/api/analyze', upload.array('files'), async (req, res) => {
  try {
    const results = [];
    for (const file of req.files) {
      const text = await pdfParse(file.buffer).then(d => d.text);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: `Анализируй текст: ${text}` }],
      });
      results.push({ name: file.originalname, analysis: completion.choices[0].message.content });
    }
    res.json({ results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'analysis failed' });
  }
});

app.get('/api/doctor/:id/analytics', async (req, res) => {
  // Placeholder for summary analytics
  res.json({ doctorId: req.params.id, stats: {} });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
