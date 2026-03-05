import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis on server side
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  try {
    const clubsData = await redis.get('clubs');
    
    // ONE-TIME CLEAR: Remove all existing data
    if (clubsData) {
      console.log('Clearing existing data from Redis...');
      await redis.del('clubs');
      return NextResponse.json({ success: true, data: null, cleared: true });
    }
    
    return NextResponse.json({ success: true, data: clubsData });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clubs' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await redis.del('clubs');
    return NextResponse.json({ success: true, message: 'All data cleared from Redis' });
  } catch (error) {
    console.error('Error clearing clubs:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear clubs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clubs = await request.json();
    await redis.set('clubs', clubs);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving clubs:', error);
    return NextResponse.json({ success: false, error: 'Failed to save clubs' }, { status: 500 });
  }
}
