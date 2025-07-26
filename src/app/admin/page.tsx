// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signOut, getCurrentUser, isAdmin } from '@/lib/auth';

interface DashboardStats {
  pendingOrders: number;
  dispatchedOrders: number;
  outOfStockItems: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    pendingOrders: 0,
    dispatchedOrders: 0,
    outOfStockItems: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // Get orders
        const ordersRef = collection(db, 'orders');
        const pendingQuery = query(ordersRef, where('status', '==', 'pending'));
        const dispatchedQuery = query(ordersRef, where('status', '==', 'dispatched'));

        const [pendingSnapshot, dispatchedSnapshot] = await Promise.all([
          getDocs(pendingQuery),
          getDocs(dispatchedQuery),
        ]);

        let totalRevenue = 0;
        dispatchedSnapshot.forEach((doc) => {
          const data = doc.data();
          totalRevenue += data.paymentReceived || 0;
        });

        // Get out of stock items
        const itemsRef = collection(db, 'items');
        const outOfStockQuery = query(itemsRef, where('inStock', '==', false));
        const outOfStockSnapshot = await getDocs(outOfStockQuery);

        setStats({
          pendingOrders: pendingSnapshot.size,
          dispatchedOrders: dispatchedSnapshot.size,
          outOfStockItems: outOfStockSnapshot.size,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time listeners for orders
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      let pending = 0;
      let dispatched = 0;
      let revenue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') {
          pending++;
        } else if (data.status === 'dispatched') {
          dispatched++;
          revenue += data.paymentReceived || 0;
        }
      });

      setStats(prev => ({
        ...prev,
        pendingOrders: pending,
        dispatchedOrders: dispatched,
        totalRevenue: revenue,
      }));
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { success } = await signOut();
    if (success) {
      router.push('/admin/login');
    }
  };

  const StatCard = ({ title, value, bgColor, textColor }: any) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-medium text-charcoal mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-cursive text-gold">Cutiefy Admin</h1>
            
            {/* Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 text-charcoal hover:bg-gray-100 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/admin/orders"
                className="block px-4 py-2 text-charcoal hover:bg-gray-100 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Manage Orders
              </Link>
              <Link
                href="/admin/categories"
                className="block px-4 py-2 text-charcoal hover:bg-gray-100 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Manage Categories
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-charcoal mb-8">Dashboard</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
                bgColor="bg-yellow-50"
                textColor="text-yellow-600"
              />
              <StatCard
                title="Dispatched Orders"
                value={stats.dispatchedOrders}
                bgColor="bg-green-50"
                textColor="text-green-600"
              />
              <StatCard
                title="Out of Stock Items"
                value={stats.outOfStockItems}
                bgColor="bg-red-50"
                textColor="text-red-600"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toFixed(2)}`}
                bgColor="bg-blue-50"
                textColor="text-blue-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-charcoal mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin/orders"
                  className="flex items-center p-4 bg-cream rounded-lg hover:bg-peach transition-colors"
                >
                  <svg
                    className="w-8 h-8 text-gold mr-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-charcoal">Manage Orders</h4>
                    <p className="text-sm text-gray-600">View and update order status</p>
                  </div>
                </Link>

                <Link
                  href="/admin/categories"
                  className="flex items-center p-4 bg-cream rounded-lg hover:bg-peach transition-colors"
                >
                  <svg
                    className="w-8 h-8 text-gold mr-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-charcoal">Manage Categories</h4>
                    <p className="text-sm text-gray-600">Update products and inventory</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}