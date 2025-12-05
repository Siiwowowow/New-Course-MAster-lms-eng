import mongoose from 'mongoose';

const classProgressSchema = new mongoose.Schema({
  classIndex: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastWatched: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  quizScore: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userId: {
    type: String, // Firebase UID
    required: true
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedClasses: {
    type: Number,
    default: 0
  },
  totalClasses: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  classProgress: [classProgressSchema],
  lastActive: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Create compound index for faster queries
courseProgressSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export default mongoose.models.CourseProgress || mongoose.model('CourseProgress', courseProgressSchema);