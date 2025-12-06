import { NextResponse } from 'next/server';
import { getWaterData } from '../../../utils/dataFetcher';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get('zip');

    if (!zip) {
        return NextResponse.json({ error: 'Zip code is required' }, { status: 400 });
    }

    try {
        const data = await getWaterData(zip);

        if (data) {
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'No data found' }, { status: 404 });

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
