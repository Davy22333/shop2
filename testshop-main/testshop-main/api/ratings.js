import { getDatabase } from './firebase.js';

export default async function handler(req, res) {
  const db = getDatabase();
  const ref = db.ref('ratings');

  if (req.method === 'POST') {
    const { stars } = req.body;
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }
    // Přidání hodnocení
    const all = (await ref.once('value')).val() || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    all[stars] = (all[stars] || 0) + 1;
    await ref.set(all);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const all = (await ref.once('value')).val() || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return res.status(200).json(all);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
