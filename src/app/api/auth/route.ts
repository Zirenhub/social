import { NextResponse } from 'next/server';
import getSession from '@/lib/getSession';
import { ApiResponse } from '@/types/api';
import successResponse, { errorResponse } from '../response';
import { getUser } from './fetching';
import { GetUserType } from '@/types/auth';

export async function GET(): Promise<NextResponse<ApiResponse<GetUserType>>> {
  try {
    const session = await getSession();
    const user = await getUser(session.user.id);

    return NextResponse.json(successResponse(user));
  } catch (error) {
    return NextResponse.json(errorResponse(error));
  }
}
