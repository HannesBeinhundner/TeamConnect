import { NextRequest, NextResponse } from 'next/server';
import { confirmInvitation } from '../../lib/ConfirmInvitationAction'; // Adjust the path if necessary

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        console.error("Invalid or missing token:", token);
        return NextResponse.json({ success: false, error: 'Invalid or missing token.' }, { status: 400 });
    }

    try {
        const result = await confirmInvitation(token);
        if (result.success) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            console.error("Error in confirmInvitation:", result.error);
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }
    } catch (error) {
        console.error("Unexpected error in handler:", error);
        return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
