import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, getDocFromServer } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, OperationType, handleFirestoreError } from './lib/firebase';
import { Plan, UserProfile } from './types';
import { generateAgenticPlan } from './services/agentService';
import { Navbar } from './components/Navbar';
import { PlanForm } from './components/PlanForm';
import { PlanList } from './components/PlanList';
import { PlanDetail } from './components/PlanDetail';
import { Loader2, Plus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        setPlans([]);
        setSelectedPlan(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'plans'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Plan[];
      setPlans(plansData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'plans');
    });

    return () => unsubscribe();
  }, [user]);

  // Connection test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const handleGeneratePlan = async (input: { requirement: string; startDate: string; endDate: string; hoursPerWeek: number }) => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const content = await generateAgenticPlan(input);
      const newPlan = {
        userId: user.uid,
        requirement: input.requirement,
        startDate: input.startDate,
        endDate: input.endDate,
        hoursPerWeek: input.hoursPerWeek,
        content,
        createdAt: Date.now(),
        id: crypto.randomUUID()
      };
      
      await addDoc(collection(db, 'plans'), newPlan);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deleteDoc(doc(db, 'plans', id));
      if (selectedPlan?.id === id) setSelectedPlan(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `plans/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-serif text-[#1A1A1A]">
      <Navbar user={user} onLogin={signInWithGoogle} onLogout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!user ? (
          <div className="text-center py-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-light mb-6 tracking-tight"
            >
              Your Personal <span className="italic">Agentic</span> Planner
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-[#5A5A40] mb-12 max-w-2xl mx-auto"
            >
              Harness the power of multi-agent AI to create detailed, actionable plans for any goal.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 bg-[#5A5A40] text-white px-8 py-4 rounded-full text-lg hover:bg-[#4A4A30] transition-colors shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Get Started with Google
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-light italic">My Plans</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="p-2 bg-[#5A5A40] text-white rounded-full hover:bg-[#4A4A30] transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <PlanList 
                plans={plans} 
                selectedId={selectedPlan?.id} 
                onSelect={setSelectedPlan} 
                onDelete={handleDeletePlan} 
              />
            </div>

            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {showForm ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <PlanForm 
                      onSubmit={handleGeneratePlan} 
                      onCancel={() => setShowForm(false)} 
                      isGenerating={isGenerating} 
                    />
                  </motion.div>
                ) : selectedPlan ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <PlanDetail plan={selectedPlan} />
                  </motion.div>
                ) : (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-[#5A5A40] border-2 border-dashed border-[#5A5A40]/20 rounded-3xl">
                    <p className="text-xl italic">Select a plan or create a new one to get started.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

