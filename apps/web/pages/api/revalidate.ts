import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.query.secret !== secret) {
    return res.status(401).json({ message: 'Invalid secret token' });
  }

  try {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ message: 'Path is required' });
    }

    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ message: 'Error revalidating', error: errorMessage });
  }
}
