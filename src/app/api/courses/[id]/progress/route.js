import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CourseProgress from '@/models/CourseProgress';

export async function GET(request, { params }) {
  try {
    // Get user ID from headers
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ 
        overallProgress: 0,
        completedClasses: 0,
        totalClasses: 0,
        averageScore: 0,
        lastActive: null,
        classProgress: []
      });
    }

    const resolvedParams = await params;
    const courseId = resolvedParams.id;
    
    await dbConnect();

    // Find progress for this user and course
    const progress = await CourseProgress.findOne({
      courseId,
      userId
    });

    if (!progress) {
      // Get total classes from course
      const Course = require('@/models/Course').default;
      const course = await Course.findById(courseId);
      const totalClasses = course?.classes?.length || 0;
      
      return NextResponse.json({
        overallProgress: 0,
        completedClasses: 0,
        totalClasses: totalClasses,
        averageScore: 0,
        lastActive: null,
        classProgress: []
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch progress',
      details: error.message 
    }, { status: 500 });
  }
}

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

    // Get course to know total classes
    const Course = require('@/models/Course').default;
    const course = await Course.findById(courseId);
    const totalClasses = course?.classes?.length || 1;

    // Find or create progress
    let progress = await CourseProgress.findOne({
      courseId,
      userId
    });

    if (!progress) {
      progress = new CourseProgress({
        courseId,
        userId,
        classProgress: [],
        totalClasses,
        startedAt: new Date()
      });
    }

    // Update class progress
    const classIndex = data.classIndex;
    
    // Initialize classProgress array if needed
    if (!progress.classProgress) {
      progress.classProgress = [];
    }

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

    // Update the class progress
    classProgress.completed = data.completed || classProgress.completed;
    classProgress.progress = data.completed ? 100 : (data.progress || classProgress.progress);
    classProgress.lastWatched = new Date();

    // Calculate overall progress
    const completedClasses = progress.classProgress.filter(cp => cp.completed).length;
    progress.completedClasses = completedClasses;
    progress.totalClasses = totalClasses;
    progress.overallProgress = Math.round((completedClasses / totalClasses) * 100);
    progress.lastActive = new Date();

    // Calculate average score (you can implement based on quizzes)
    if (data.quizScore) {
      const totalScores = progress.classProgress.reduce((sum, cp) => sum + (cp.quizScore || 0), 0);
      const completedWithScore = progress.classProgress.filter(cp => cp.quizScore).length;
      progress.averageScore = completedWithScore > 0 ? Math.round(totalScores / completedWithScore) : 0;
    }

    await progress.save();

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update progress',
      details: error.message 
    }, { status: 500 });
  }
}