/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronLeft, GraduationCap, Home, Award, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';
import { lessons, Lesson, QuizQuestion } from './data';

type ViewState = 'home' | 'lesson' | 'quiz' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
    window.scrollTo(0, 0);
  };

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setCurrentView('quiz');
    window.scrollTo(0, 0);
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (selectedLesson && index === selectedLesson.quiz[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (!selectedLesson) return;
    
    if (currentQuestionIndex < selectedLesson.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      setCurrentView('results');
    }
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedLesson(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">النحو العربي</h1>
              <p className="text-emerald-100 text-xs">إعداد جابر مشابط</p>
            </div>
          </div>
          {currentView !== 'home' && (
            <button 
              onClick={goHome}
              className="p-2 hover:bg-emerald-600 rounded-full transition-colors flex items-center gap-2 text-sm"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Home View */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center mb-8">
                <GraduationCap className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">مرحباً بك في تطبيق النحو العربي</h2>
                <p className="text-slate-600">اختر درساً للبدء في التعلم واختبر معلوماتك بعد كل درس.</p>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">الدروس المتاحة</h3>
              <div className="grid gap-4">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all text-right flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {lesson.title}
                      </span>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lesson View */}
          {currentView === 'lesson' && selectedLesson && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-800 text-white p-6">
                  <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                </div>
                <div className="p-6 md:p-8 prose prose-slate prose-lg max-w-none rtl:prose-p:text-right rtl:prose-headings:text-right prose-headings:text-emerald-800 prose-p:text-slate-700 prose-p:leading-relaxed">
                  <Markdown>{selectedLesson.content}</Markdown>
                </div>
              </div>

              {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                <button
                  onClick={startQuiz}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <Award className="w-6 h-6" />
                  ابدأ الاختبار التفاعلي
                </button>
              )}
            </motion.div>
          )}

          {/* Quiz View */}
          {currentView === 'quiz' && selectedLesson && selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6 flex items-center justify-between text-sm font-medium text-slate-500 px-2">
                <span>اختبار: {selectedLesson.title}</span>
                <span>السؤال {currentQuestionIndex + 1} من {selectedLesson.quiz.length}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${((currentQuestionIndex) / selectedLesson.quiz.length) * 100}%` }}
                ></div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
                  {selectedLesson.quiz[currentQuestionIndex].question}
                </h3>

                <div className="space-y-3">
                  {selectedLesson.quiz[currentQuestionIndex].options.map((option, index) => {
                    const isCorrect = index === selectedLesson.quiz[currentQuestionIndex].correctAnswerIndex;
                    const isSelected = selectedAnswer === index;
                    
                    let buttonClass = "w-full text-right p-4 rounded-xl border-2 transition-all text-lg ";
                    
                    if (!showExplanation) {
                      buttonClass += "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700";
                    } else {
                      if (isCorrect) {
                        buttonClass += "border-emerald-500 bg-emerald-100 text-emerald-800 font-bold";
                      } else if (isSelected) {
                        buttonClass += "border-red-500 bg-red-50 text-red-800";
                      } else {
                        buttonClass += "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      className="bg-blue-50 border border-blue-100 rounded-xl p-5"
                    >
                      <p className="text-blue-800 font-medium">
                        {selectedAnswer === selectedLesson.quiz[currentQuestionIndex].correctAnswerIndex 
                          ? '✅ إجابة صحيحة!' 
                          : '❌ إجابة خاطئة.'}
                      </p>
                      <p className="text-blue-700 mt-2 text-sm leading-relaxed">
                        {selectedLesson.quiz[currentQuestionIndex].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {showExplanation && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={nextQuestion}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  {currentQuestionIndex < selectedLesson.quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Results View */}
          {currentView === 'results' && selectedLesson && selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center space-y-8 py-12"
            >
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">اكتمل الاختبار!</h2>
                <p className="text-slate-500 mb-8">درس: {selectedLesson.title}</p>
                
                <div className="text-6xl font-black text-emerald-600 mb-4">
                  {score} <span className="text-2xl text-slate-400 font-medium">/ {selectedLesson.quiz.length}</span>
                </div>
                
                <p className="text-lg text-slate-600 font-medium">
                  {score === selectedLesson.quiz.length ? 'ممتاز! لقد أتقنت هذا الدرس.' : 
                   score >= selectedLesson.quiz.length / 2 ? 'جيد جداً! استمر في التعلم.' : 
                   'حاول مرة أخرى لمراجعة المعلومات.'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={startQuiz}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  إعادة الاختبار
                </button>
                <button
                  onClick={goHome}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  العودة للدروس
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
