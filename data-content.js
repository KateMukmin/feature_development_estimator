import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient();
 
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://featuredevelopmentestimator.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') return res.status(200).end();
 
  try {
    if (req.method === 'GET') {
      const data = await prisma.estimatorData.findFirst({ orderBy: { updatedAt: 'desc' } });
      return res.status(200).json(data ? JSON.parse(data.payload) : { devs: [], qas: [], epics: [] });
    }
 
    if (req.method === 'POST') {
      const payload = JSON.stringify(req.body);
      const existing = await prisma.estimatorData.findFirst();
      if (existing) {
        await prisma.estimatorData.update({ where: { id: existing.id }, data: { payload, updatedAt: new Date() } });
      } else {
        await prisma.estimatorData.create({ data: { payload, updatedAt: new Date() } });
      }
      return res.status(200).json({ ok: true });
    }
 
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
}
 
