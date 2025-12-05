import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CourseProgress from '@/models/CourseProgress';

export async function POST(request, { params }) {
  try {
    // Get user ID from headers
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const resolvedParams = await params;
    const courseId = resolvedParams.id;
    const data = await request.json();
    
    await dbConnect();

    // Find progress
    let progress = await CourseProgress.findOne({
      courseId,
      userId
    });

    if (!progress) {
      progress = new CourseProgress({
        courseId,
        userId,
        classProgress: []
      });
    }

    // Find or create class progress for notes
    const classIndex = data.classIndex;
    let classProgress = progress.classProgress.find(cp => cp.classIndex === classIndex);
    
    if (!classProgress) {
      classProgress = {
        classIndex,
        completed: false,
        progress: 0,
        lastWatched: null,
        notes: ''
      };
      progress.classProgress.push(classProgress);
    }

    // Update notes
    classProgress.notes = data.notes || '';
    classProgress.lastWatched = new Date();

    await progress.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Notes saved successfully' 
    });
  } catch (error) {
    console.error('Notes save error:', error);
    return NextResponse.json({ 
      error: 'Failed to save notes',
      details: error.message 
    }, { status: 500 });
  }
}